import React from "react";
import "../styles/styles.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Tooltip } from "@mui/material";

const Header = () => {
  return (
    <div className="Header">
      <span className="heading">Helpdesk</span>
      <Tooltip title="LOGOUT">
        <IconButton>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Header;
