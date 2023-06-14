import React from "react";
import "../styles/styles.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
    sessionStorage.clear();
  };
  const navigate = useNavigate();
  return (
    <div className="Header">
      <div>
        {/* <img
          src={`${process.env.PUBLIC_URL}/assets/costacloud.png`}
          alt="costacloud-logo"
          height={25}
        /> */}
        <span className="heading">Helpdesk</span>
      </div>
      <Tooltip title="LOGOUT">
        <IconButton
          onClick={() => {
            handleLogout();
          }}
        >
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Header;
