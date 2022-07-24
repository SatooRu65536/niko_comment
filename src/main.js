const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const serviceAccount = require("./serviceAccountKey.json");
const admin = require("firebase-admin");
const moment = require('moment');

const currentTime = moment().utc();
const start_time = Number(currentTime.format("YYYYMMDDHHmmss"));

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 839,
    height: 513,
    width: 1678,
    height: 1026,
    hasShadow: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setIgnoreMouseEvents(true);
  // mainWindow.webContents.openDevTools();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nikocomments-65536-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });

  const db = admin.database();
  const ref = db.ref('nikocomments/');

  ref.on("value", function (snapshot) {
    const data = snapshot.val();
    for (let key in data) {
      const time = Number(key);
      const comment = data[key]['comment'];
      const ref2 = db.ref(`nikocomments/${key}`);

      if (time > start_time) {
        mainWindow.webContents.send('update-counter', comment);
      }
      ref2.remove();
    }
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

