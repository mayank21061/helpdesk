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
  });

  const [stompClient, setStompClient] = useState("");
  const [connected, setConnected] = useState(false);
  const [helpDesk, setHelpDesk] = useState("");
  const [users, setUsers] = useState([]);
  const [sender, setSender] = useState(null);
  const [helper, setHelper] = useState("");

  useEffect(() => {
    fetch("http://11.0.0.118:8537/get-senders/7wg.cad.cad")
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        setUsers(resp);
        setHelper("7wg.cad.cad");
      });
  }, []);

  useEffect(() => {
    console.log(sender);
    if (sender !== null) {
      fetch(`http://11.0.0.118:8537/get-chat/${sender.user}`, {
        headers: { sender: "7wg.cad.cad" },
      })
        .then((resp) => {
          return resp.json();
        })
        .then((resp) => {
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
          setmessages(tempArr);
        });
    }
  }, [sender]);

  useEffect(() => {
    if (stompClient) {
      stompClient.debug = null;
      stompClient.connect({}, onConnected, onError);
    } else {
      connect();
    }
  }, [stompClient]);

  // connecting to socket
  const connect = async () => {
    let Sock = new SockJS(process.env.REACT_APP_HELPDESK_SOCKET);
    let client = over(Sock);
    // setHelpDesk(helpDesk);
    setStompClient(client);
  };

  const onConnected = () => {
    setConnected(true);
    stompClient.subscribe(`/user/7wg.cad.cad/private`, onGetNotifications);
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
      const { text, file } = lastQuery;
      let chatMessage;

      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          chatMessage = {
            sender: "7wg.cad.cad",
            receiverName: `${sender.user}`,
            text: text,
            file: base64,
          };
          send(chatMessage);
        };
      } else {
        chatMessage = {
          sender: "7wg.cad.cad",
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

  const addUserMsg = (msg, blob) => {
    console.log(msg, blob);
    let uuid = uuidv4();
    let userMsg = {
      uuid,
      isBot: false,
      component: (
        <UserMessage key={uuid} uuid={uuid} message={msg} blob={blob} />
      ),
    };
    setmessages((prevState) => [...prevState, userMsg]);
    setlastQuery({
      text: msg,
      file: blob,
    });
  };

  const send = (body) => {
    console.log(body);
    stompClient.send("/helpdesk/private-message", {}, JSON.stringify(body));
  };

  return (
    <HelpdeskContext.Provider
      value={{
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
