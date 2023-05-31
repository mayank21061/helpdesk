import React, { useContext } from "react";
import ChatListItems from "./ChatListItems";
import { HelpdeskContext } from "../ChatContext";
const ChatList = () => {
  const { users } = useContext(HelpdeskContext);
  return (
    <div className="chatList">
      {users && users.map((item) => <ChatListItems user={item} />)}
    </div>
  );
};

export default ChatList;
