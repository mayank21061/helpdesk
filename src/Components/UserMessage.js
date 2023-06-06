import { Avatar, IconButton } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const UserMessage = ({ uuid, message, blob }) => {
  useEffect(() => {
    scrollToBottm();
  }, []);

  useEffect(() => {
    if (blob) {
      const file = new File([blob], "New ss", { type: "application/pdf" });
    }
  }, [blob]);

  const scrollToBottm = () => {
    let element = document.getElementById("chat-body");
    element.scrollTo({
      top: element.scrollHeight - element.clientHeight,
      behavior: "smooth",
    });
  };

  const handleFullScreen = (base64) => {
    if (typeof base64 === "string") {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      const newWindow = window.open(fileURL, "_blank");
      if (!newWindow) {
        window.location.href = fileURL;
      }
    } else {
      const fileUrl = URL.createObjectURL(base64);
      console.log(base64);
      window.open(fileUrl);
    }
  };

  if (blob) {
    return (
      <div className="user-message-img-container">
        <div className="userMessage-img">
          <div className="pdfIcon" onClick={(e) => handleFullScreen(blob)}>
            <PictureAsPdfIcon />
          </div>
          {message && <span>{message}</span>}
        </div>
      </div>
    );
  } else {
    return (
      <div className="user-message-container">
        <div className="userMessage-img">
          <span>{message}</span>
        </div>
      </div>
    );
  }
};

export default UserMessage;
