import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";

const HomeScreen = () => {
  return (
    <div className="HomeScreen">
      <ChatList />
      <Chat />
    </div>
  );
};

export default HomeScreen;
