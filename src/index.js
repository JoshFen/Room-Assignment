/* app is our electron application we are grabbing from the 
 * electron library, along with the BrowserWindow object used to
 * create our application window and the the ipcMain object that
 * is used to communicate with the ipcRenderer.
 */ 
const { app, BrowserWindow, ipcMain } = require('electron');
const Store = require('electron-store');
const { download } = require('electron-dl');
const { join } = require('path');
const fs = require('fs'); 
const { splitStudents } = require('./processes/studentSplitter');
const { determineStudentPriority } = require('./processes/priorities');
const { makeUnfilledRooms, runRoomAssignment } = require('./processes/roomAssignment');
const { makeStudentsReadable, makeExtraStudentsReadable, convertJsonToExcel } = require('./processes/convertToExcel');

// Creates store for storing user data
const store = new Store();

/* 
 * Creates the display window with the assigned dimensions
 * and html file.
 */
const createWindow = () => {
  // 'win' is a variable set to an instance of BrowserWindow
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    resizable: false,
    icon: join(__dirname, '../assets/psulogo.ico'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      devTools: true,
      sandbox: false
    }
  })

  // Loads the given html file into the display window
  win.loadFile('src/index.html');
}

/*
  * This function is triggered when the application loads
  * calls our createWindow() function to create the application
  * window that is initially set to display index/html.
  */
app.whenReady().then(() => {
  createWindow();
  //createBlueprint('data/floorplan.json');
})

/*
  * ipcMain listens for the ipcRenderer to send data on the 
  * 'uploadFile' channel. The data that is sent over this channel
  * is processed here. We trigger the room assignment within this 
  * function body
  */ 
ipcMain.on('uploadFile', (channel, data) => {
  store.set('file', data);
  const currentWin = BrowserWindow.getFocusedWindow();
  currentWin.webContents.send('changePageToPreprocess');
})

ipcMain.on('sendLLCInfo', (channel, data) => {
  store.set('LLCInfo', data);
  createPopupWindow('confirmation-popup.html');
})

ipcMain.on('cancelRun', (channel, data) => {
  closePopupWindow();
})

ipcMain.handle('runAssignment', (channel, data) => {

  closePopupWindow();

  const [uM, lM, uF, lF] = splitStudents(store.get('file'));
  let queuesUM = determineStudentPriority(uM);
  let queuesUF = determineStudentPriority(uF);
  let queuesLM = determineStudentPriority(lM);
  let queuesLF = determineStudentPriority(lF);
  
  const extras = [queuesUM.extras, queuesLF.extras, queuesLM.extras, queuesUF.extras];

  fs.readFile(join(__dirname, "../data/blueprint.json"), 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    let unfilledRooms = {"incomplete": {}, "empty": {}};
    let blueprintCopy = JSON.parse(jsonString);

    unfilledRooms = makeUnfilledRooms(blueprintCopy, unfilledRooms);   

    const [finalBlueprint, extraStudents] = runRoomAssignment(blueprintCopy, unfilledRooms, store.get('LLCInfo'), queuesUM, queuesUF, queuesLM, queuesLF);

    if (finalBlueprint === false) {
      const currentWin = BrowserWindow.getFocusedWindow();
      currentWin.webContents.send('LLCInfoError');
    }
    else {
      store.set('outputFilePath', join(__dirname, "../" + convertJsonToExcel(makeStudentsReadable(finalBlueprint), false)));
      store.set('outputExtraFilePath', join(__dirname, "../" + convertJsonToExcel(makeExtraStudentsReadable(extraStudents), true)));

      const currentWin = BrowserWindow.getFocusedWindow();
      currentWin.webContents.send('changePageToPostprocess');
    }
  })
})

/*
  * ipcMan listens for the ipcRenderer to send a download request
  * with the url location of a file to be downloaded. The download
  * is started and once it is complete sends a boolean to represent
  * the success of the download back to the ipcRenderer.
  */ 
ipcMain.on('downloadFile', async (channel, data) => {
  const win = BrowserWindow.getFocusedWindow();
  if (fs.existsSync(store.get('outputFilePath')) && fs.existsSync(store.get('outputExtraFilePath'))) {
    await download(win, store.get('outputFilePath'), {openFolderWhenDone: true}).catch(err => createPopupWindow('download-error-popup.html'));
    await download(win, store.get('outputExtraFilePath'), {openFolderWhenDone: true}).catch(err => createPopupWindow('download-error-popup.html'));
    removeFile();
  }
  else {
    createPopupWindow('download-error-popup.html');
  }
});


ipcMain.on('closeErrorPopup', (channel, data) => {
  closePopupWindow();
  app.quit();
}) 

/*
  * app is listening on the 'window-all-closed' channel for a 
  * message to close all the application windows.
  */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    removeFile().then(app.quit());
  }
})

ipcMain.on('close', () => {
  if (process.platform !== 'darwin') {
    removeFile().then(app.quit());
  }
})

ipcMain.on('minimize', () => {
  BrowserWindow.getFocusedWindow().minimize();
})

const removeFile = async ()=> {
  if (fs.existsSync(store.get('outputFilePath'))) {
    await fs.unlink(store.get('outputFilePath'), (err => {
      if (err) {
        createPopupWindow('download-error-popup.html');
      }
    }));
  }
  if (fs.existsSync(store.get('outputExtraFilePath'))) {
    await fs.unlink(store.get('outputExtraFilePath'), (err => {
      if (err) {
        createPopupWindow('download-error-popup.html');
      }
    }));
  }
}

const createPopupWindow = (content) => {
  const currentWin = BrowserWindow.getFocusedWindow();
  currentWin.showInactive();
  //currentWin.setClosable(false);
  const newWin = new BrowserWindow({
    width: 350,
    height: 175,
    minWidth: 350,
    minHeight: 175,
    frame: false,
    resizable: true,
    parent: currentWin,
    icon: join(__dirname, '../assets/psulogo.ico'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      devTools: true,
      sandbox: false
    }
  })
  newWin.loadFile('src/views/' + content)
}

const closePopupWindow = () => {
  const currentWin = BrowserWindow.getFocusedWindow();
  const parentWin = currentWin.getParentWindow();
  parentWin.show();
  parentWin.setClosable(true);
  currentWin.close();
}