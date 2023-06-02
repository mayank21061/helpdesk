import React, { useContext } from "react";
import ChatListItems from "./ChatListItems";
import { HelpdeskContext } from "../ChatContext";
const ChatList = () => {
  const { users } = useContext(HelpdeskContext);
  return (
    <div className="chatList">
      {users?.length > 0 ? (
        users.map((item, index) => <ChatListItems user={item} key={index} />)
      ) : (
        <div className="no-message">
          <span>Inbox is empty</span>
        </div>
      )}
    </div>
  );
};

export default ChatList;
