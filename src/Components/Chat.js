import React, { useContext } from "react";
import ChatInput from "./ChatInput";
import ChatBody from "./ChatBody";
import { HelpdeskContext } from "../ChatContext";

const Chat = () => {
  const { user, loading } = useContext(HelpdeskContext);
  return (
    <div className="chat">
      <ChatBody user={user} />
      <ChatInput />
    </div>
  );
};

export default Chat;
