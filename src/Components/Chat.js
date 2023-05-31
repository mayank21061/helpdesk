import React from "react";
import ChatInput from "./ChatInput";
import ChatBody from "./ChatBody";

const Chat = () => {
  return (
    <div className="chat">
      <ChatBody/>
      <ChatInput />
    </div>
  );
};

export default Chat;
