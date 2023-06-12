import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";
import { useContext } from "react";
import { HelpdeskContext } from "../ChatContext";
import Header from "./Header";

const HomeScreen = () => {
  const { user } = useContext(HelpdeskContext);
  return (
    <>
      <Header />
      <div className="HomeScreen">
        <ChatList />
        <Chat />
      </div>
    </>
  );
};

export default HomeScreen;
