import React, { useContext } from "react";
import { HelpdeskContext } from "../ChatContext";

const ChatBody = () => {
  const { messages } = useContext(HelpdeskContext);
  console.log(messages);
  return (
    <div className="chat-body" id="chat-body">
      {messages.map((item) => (
        <div key={item.uuid}>{item.component}</div>
      ))}
    </div>
  );
};

export default ChatBody;
