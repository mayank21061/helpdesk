import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BotMessage from "./Components/BotMessage";
import UserMessage from "./Components/UserMessage";
// import SockJS from "sockjs-client";
// import { over } from "stompjs";

export const HelpdeskContext = createContext();

export const HelpdeskProvider = ({ children }) => {
  let role = sessionStorage.getItem("role");

  let uuid = uuidv4();
  // const initilMessage = {
  //   uuid,
  //   isBot: true,
  //   component: (
  //     <BotMessage
  //       key={uuid}
  //       uuid={uuid}
  //       message="Hello What Can I Do For You"
  //     />
  //   ),
  // };

  const [openBot, setopenBot] = useState(false);
  const [messages, setmessages] = useState([]);
  const [lastQuery, setlastQuery] = useState({
    text: "",
    file: "",
  });

  const [stompClient, setStompClient] = useState("");
  const [connected, setConnected] = useState(false);
  const [helpDesk, setHelpDesk] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://11.0.0.118:8537/get-senders/7wg.aco.aco")
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        setUsers(resp);
      });
  }, []);
  // useEffect(() => {
  //   if (stompClient) {
  //     stompClient.debug = null;
  //     stompClient.connect({}, onConnected, onError);
  //   } else {
  //     connect();
  //   }
  // }, [stompClient]);

  // connecting to socket
  // const connect = async () => {
  //   let helpDesk = await (
  //     await fetch(process.env.REACT_APP_GET_SUPPORT)
  //   ).text();
  //   let Sock = new SockJS(process.env.REACT_APP_CHAT_BOT);
  //   let Client = over(Sock);
  //   setHelpDesk(helpDesk);
  //   setStompClient(Client);
  // };

  const onConnected = () => {
    setConnected(true);
    stompClient.subscribe(`/user/${role}/private`, onGetNotifications);
  };

  const onGetNotifications = (payload) => {
    let data = JSON.parse(payload.body);
    console.log(data);
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
            sender: role,
            receiverName: helpDesk,
            text: text,
            file: base64,
          };
          send(chatMessage);
        };
      } else {
        chatMessage = {
          sender: role,
          receiverName: helpDesk,
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
    stompClient.send("/helpdesk/private-message", {}, JSON.stringify(body));
  };

  return (
    <HelpdeskContext.Provider
      value={{
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
