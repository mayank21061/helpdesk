import React from "react";
import "../styles/styles.css";
const ChatListItems = (props) => {
  return (
    <div className="chatListItems">
      <span className="user">{props.user}</span>
      <span className="msg">
        efhewrfhceruicuwdfguwevefiuegviceqruivcvuiqerc
      </span>
    </div>
  );
};

export default ChatListItems;
