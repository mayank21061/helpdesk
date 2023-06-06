import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";
import { useContext } from "react";
import { HelpdeskContext } from "../ChatContext";

const HomeScreen = () => {
  const { user } = useContext(HelpdeskContext);
  return (
    <div className="HomeScreen">
      <ChatList />
      <Chat />
    </div>
  );
};

export default HomeScreen;
