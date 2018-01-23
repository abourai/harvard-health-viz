'use strict';

// Import parts of electron to use
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path')
const url = require('url')
const { exec } = require('child_process');
const fs = require('fs')
const patientsFolder = 'src/assets/data/';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, height: 768, show: false
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Install React Dev Tools
  const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

  installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
      console.log(`Added Extension:  ${name}`);
  })
  .catch((err) => {
      console.log('An error occurred: ', err);
  });
}

function lookup_means_visual(event) {
  const meansFile = path.join(__dirname,patientsFolder, 'means_visual.json');
  console.log(meansFile);
  console.log(__dirname);
  var json_object = null;
  fs.readFile(meansFile, function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    json_object = JSON.parse(data);
    console.log(json_object);
    event.sender.send('asynchronous-reply', json_object)
  });
}

function lookup_patient_visual(event, patientID) {
  const patientFile = path.join(__dirname,patientsFolder, 'openface', patientID, patientID + '_visual_summary.json');
  console.log(patientFile);
  console.log(__dirname);
  var json_object = null;
  fs.readFile(patientFile, function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    json_object = JSON.parse(data);
    console.log(json_object);
    event.sender.send('asynchronous-reply', json_object)
  });
}

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('took a second') // prints "ping"
  var return_message = 'pong';
  if (arg[0] === 'run_script') {
    exec('sh src/assets/scripts/test.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
  console.log(arg[0]);
  if (arg[0] === 'get_patient') {
    return_message = lookup_patient_visual(event, arg[1]);
  }

  if (arg[0] === 'get_means' && arg[1] == 'visual') {
    return_message = lookup_means_visual(event);
  }

  console.log(return_message);

})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
