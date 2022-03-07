const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const child_process = require("child_process");

let mainWindow;

function createWindow() {
  var prc = child_process.spawn("dotnet", [
    path.join(__dirname, "backend", "Api.dll"),
  ]);

  var ls = child_process.spawn("ls", [
    "-la",
    path.join(__dirname, "backend", "Api.dll"),
  ]);

  ls.stdout.on("data", (data) => {
    console.log(`child stdout:\n${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.error(`child stderr:\n${data}`);
  });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "build", "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    prc.kill();
    ls.kill();
    //cmd.kill();
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {  
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
