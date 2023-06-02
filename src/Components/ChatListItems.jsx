import React, { useContext } from "react";
import "../styles/styles.css";
import { HelpdeskContext } from "../ChatContext";
const ChatListItems = (props) => {
  const { setSender } = useContext(HelpdeskContext);
  return (
    <div className="chatListItems" onClick={() => setSender(props)}>
      <span className="user">{props.user}</span>
      <span className="msg">
        efhewrfhceruicuwdfguwevefiuegviceqruivcvuiqerc
      </span>
    </div>
  );
};

export default ChatListItems;
