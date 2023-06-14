import React from "react";
import "./styles/styles.css";
import HomeScreen from "./Components/HomeScreen";
import { HelpdeskProvider } from "./ChatContext";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";

function App() {
  return (
    <HelpdeskProvider>
      <div className="app">
        <HashRouter>
          <Routes>
            <Route exact path="/" Component={LoginPage} />
            <Route path="/helpdesk" Component={HomeScreen} />
          </Routes>
        </HashRouter>
      </div>
    </HelpdeskProvider>
  );
}

export default App;
