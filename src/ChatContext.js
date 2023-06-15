import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BotMessage from "./Components/BotMessage";
import UserMessage from "./Components/UserMessage";
import SockJS from "sockjs-client";
import { over } from "stompjs";

export const HelpdeskContext = createContext();

export const HelpdeskProvider = ({ children }) => {
  let uuid = uuidv4();
  let initilMessage = {
    // uuid,
    // isBot: true,
    // component: (
    //   <BotMessage
    //     key={uuid}
    //     uuid={uuid}
    //     message="Hello What Can I Do For You"
    //   />
    // ),
  };

  const [openBot, setopenBot] = useState(false);
  const [messages, setmessages] = useState([initilMessage]);
  const [lastQuery, setlastQuery] = useState({
    text: "",
    file: "",
    fileName: "",
  });

  const [stompClient, setStompClient] = useState("");
  const [connected, setConnected] = useState(false);
  const [helpDesk, setHelpDesk] = useState("");
  const [users, setUsers] = useState([]);
  const [sender, setSender] = useState(null);
  const [helper, setHelper] = useState("");
  const [helperInfo, setHelperInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole)
      fetch(`http://11.0.0.118:8537/get-senders/${userRole}`)
        .then((resp) => {
          return resp.json();
        })
        .then((resp) => {
          setUsers(resp);
          setHelper(userRole);
          setLoading(false);
        });
  }, [userRole]);

  useEffect(() => {
    if (username) {
      fetch(`http://11.0.0.118:9090/user_service/api/getUserRoles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username,
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        },
      }).then(async (resp) => {
        const data = await resp.json();
        setLoading(false);
        data.data.map((item) => setUserRole(item.deptRole));
      });
    }
  }, [username]);

  useEffect(() => {
    if (sender !== null && userRole) {
      fetch(`http://11.0.0.118:8537/get-chat/${sender.user}`, {
        headers: { sender: userRole },
      })
        .then((resp) => {
          return resp.json();
        })
        .then((resp) => {
          setLoading(true);
          let tempArr = [];
          resp.map((item) =>
            tempArr.push({
              uuid: uuidv4(),
              isBot: item.receiverName === helper ? true : false,
              component:
                item.receiverName === helper ? (
                  <BotMessage
                    key={uuid}
                    uuid={uuid}
                    message={item.text}
                    blob={item.file}
                  />
                ) : (
                  <UserMessage
                    key={uuid}
                    uuid={uuid}
                    message={item.text}
                    blob={item.file}
                  />
                ),
            })
          );
          setLoading(false);
          setmessages(tempArr);
        });
    }
  }, [sender]);

  useEffect(() => {
    if (stompClient) {
      stompClient.debug = null;
      stompClient.connect({}, onConnected, onError);
    } else if(userRole) {
      connect();
    }
  }, [stompClient,userRole]);

  // connecting to socket
  const connect = async () => {
    let Sock = new SockJS(process.env.REACT_APP_HELPDESK_SOCKET);
    let client = over(Sock);
    // setHelpDesk(helpDesk);
    setStompClient(client);
  };

  const onConnected = () => {
    console.log(userRole);
    setConnected(true);
    console.log("hello",userRole)
    stompClient.subscribe(`/user/${userRole}/private`, onGetNotifications);
  };

  const onGetNotifications = (payload) => {
    let data = JSON.parse(payload.body);
    console.log("data == ", data);
    addBotMsg(data.text, data.file);
  };

  const onError = (err) => {
    console.log(err.message);
  };

  // in this useEffect based on userQuery either callApi for response from assistant and from socket
  useEffect(() => {
    if (lastQuery.text || lastQuery.file) {
      const { text, file, fileName } = lastQuery;
      let chatMessage;
      console.log(fileName);
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          chatMessage = {
            sender: userRole,
            receiverName: `${sender.user}`,
            text,
            file: base64,
            filename: fileName,
          };
          send(chatMessage);
        };
      } else {
        chatMessage = {
          sender: userRole,
          receiverName: `${sender.user}`,
          text: text,
          file: "",
        };
        send(chatMessage);
      }
    }
  }, [lastQuery]);

  const addBotMsg = (msg, blob) => {
    let uuid = uuidv4();
    let botMsg = {
      uuid,
      isBot: true,
      component: (
        <BotMessage key={uuid} uuid={uuid} message={msg} blob={blob} />
      ),
    };
    setmessages((prevState) => [...prevState, botMsg]);
  };

  const addUserMsg = (msg, blob, filename) => {
    let uuid = uuidv4();
    let userMsg = {
      uuid,
      isBot: false,
      component: (
        <UserMessage
          key={uuid}
          uuid={uuid}
          message={msg}
          blob={blob}
          fileName={filename}
        />
      ),
    };
    setmessages((prevState) => [...prevState, userMsg]);
    setlastQuery({
      text: msg,
      file: blob,
      fileName: filename,
    });
  };

  const send = (body) => {
    console.log(body);
    stompClient.send("/helpdesk/private-message", {}, JSON.stringify(body));
  };

  return (
    <HelpdeskContext.Provider
      value={{
        loading,
        setLoading,
        setUsername,
        helper,
        sender,
        setSender,
        users,
        openBot,
        setopenBot,
        messages,
        setmessages,
        addBotMsg,
        addUserMsg,
        connected,
        helpDesk,
      }}
    >
      {children}
    </HelpdeskContext.Provider>
  );
};
