import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import Loading from "./Loading";
import { useEffect } from "react";

const BotMessage = ({ uuid, message, blob }) => {
  // console.log(blob);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (!loading) scrollToBottm();
  }, [loading]);

  const scrollToBottm = () => {
    let element = document.getElementById("chat-body");
    element.scrollTo({
      top: element.scrollHeight - element.clientHeight,
      behavior: "smooth",
    });
  };

  const handleFullScreen = (string) => {
    const url = convertToBlob(string);
    window.open(url);
  };

  const convertToBlob = (string) => {
    const decodedBytes = Buffer.from(string, "base64");
    const blob = new Blob([decodedBytes], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    return url;
  };

  if (blob) {
    return (
      <div className="bot-message-img-container">
        <Avatar
          variant="circular"
          className="botAvatar"
          // src={`${process.env.PUBLIC_URL}/assets/images/bot-logo.png`}
        >
          <AiOutlineUser />
        </Avatar>
        <div className="botMessage">
          {loading ? (
            <Loading />
          ) : (
            <div className="botMessage-img">
              <img
                className="ss-img"
                src={blob ? convertToBlob(blob) : ""}
                alt="ScreenShot"
                onClick={() => handleFullScreen(blob)}
              />
              {message && <span>{message}</span>}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bot-message-container">
        <Avatar
          variant="circular"
          className="botAvatar"
          src={`${process.env.PUBLIC_URL}/assets/images/bot-logo.png`}
        >
          <AiOutlineUser />
        </Avatar>
        <div className="botMessage">
          {loading ? <Loading /> : <span>{message}</span>}
        </div>
      </div>
    );
  }
};

export default BotMessage;
