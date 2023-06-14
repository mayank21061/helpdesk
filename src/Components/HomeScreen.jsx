import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";
import { useContext } from "react";
import { HelpdeskContext } from "../ChatContext";
import Header from "./Header";
import { Backdrop, CircularProgress } from "@mui/material";

const HomeScreen = () => {
  const { loading } = useContext(HelpdeskContext);
  return (
    <>
      <Header />
      <div className="HomeScreen">
        <ChatList />
        <Chat />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default HomeScreen;
