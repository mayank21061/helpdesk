const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const path = require("path");
const windowStateKeeper = require("electron-window-state");
const isDev = require("electron-is-dev");
require("dotenv").config();
const fs = require("fs");
const { spawn } = require("child_process");

const warPath = `${path.join(__dirname, "./doctosfdt.war")}`;

let win;

function createWindow(width, height) {
  let mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // frame: false,
    icon: path.join(__dirname, "../public/favicon.ico"),
    title: "Help Desk",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: `${path.join(__dirname, "./preload.js")}`,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000/eoffice"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.on("closed", () => {
    win = null;
  });

  mainWindowState.manage(win);
  isDev && win.webContents.openDevTools();
}

app.on("ready", () => {
  Menu.setApplicationMenu(null);
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  createWindow(width, height);
  spawn("java", ["-jar", warPath]);
  // ipcMain.on("docxtosfdt", (event, buffer) => {
  //   exec("java -jar doctosfdt.war");
  // });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
