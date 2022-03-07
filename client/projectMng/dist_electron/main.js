import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
let win;
function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, `./../dist/project-mng/index.html`),
        protocol: "file:",
        slashes: true
    }));
    win.webContents.openDevTools();
}
app.on("ready", createWindow);
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
function isRoot() {
    return path.parse(process.cwd()).root == process.cwd();
}
function getDirectory() {
    fs.readdir('.', { withFileTypes: true }, (err, files) => {
        if (!err) {
            const directories = files
                .filter(file => file.isDirectory())
                .map(file => file.name);
            if (!isRoot()) {
                directories.unshift('..');
            }
            win.webContents.send("getDirectoryResponse", directories);
        }
    });
}
ipcMain.on("navigateDirectory", (event, path) => {
    process.chdir(path);
    getDirectory();
});
//# sourceMappingURL=main.js.map