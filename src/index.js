/* app is our electron application we are grabbing from the 
 * electron library, along with the BrowserWindow object used to
 * create our application window and the the ipcMain object that
 * is used to communicate with the ipcRenderer.
 */ 
const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const { download } = require('electron-dl'); 
const { genderSort, determinePriority } = require('./processes/studentSorter');
const fs = require('fs');
const { readExcel } = require('./processes/fileReader');
const { LLCBlocking } = require('./processes/roomBlocker');

/* 
 * Creates the display window with the assigned dimensions
 * and html file.
 */
const createWindow = () => {
    // 'win' is a variable set to an instance of BrowserWindow
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true,
      resizable: false,
      icon: join(__dirname, '../assets/psulogo.ico'),
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
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
  })

  /*
   * ipcMain listens for the ipcRenderer to send data on the 
   * 'uploadFile' channel. The data that is sent over this channel
   * is processed here. We trigger the room assignment within this 
   * function body
   */ 
  ipcMain.handle('uploadFile', (channel, data) => {

    const [uM, lM, uF, lF] = genderSort(data);
    const queuesUM = determinePriority(uM);
    const queuesUF = determinePriority(uF);
    const queuesLM = determinePriority(lM);
    const queuesLF = determinePriority(lF);
    
    console.log(Object.keys(lF).length, queuesLF['ra'].length, queuesLF['roommate'].length, queuesLF['LLCs']['LLC FirstGen'].length, queuesLF['LLCs']['LLC Global Village'].length, queuesLF['floors']['f1'].length, queuesLF['floors']['f2'].length, queuesLF['floors']['f3'].length, queuesLF['floors']['f4'].length, queuesLF['floors']['f5'].length, queuesLF['noPref'].length, queuesLF['extras'].length)
    console.log(queuesLF['extras']);
    const bp = JSON.stringify(queuesLF)
        fs.writeFile("output.json", bp, err => {
            if(err){
                throw err;
            }
            console.log("Blueprint successfully created.")
        })// End of fs.writeFile function.
    let win = new BrowserWindow({width: 800, height: 600});
    win.loadFile('src/postprocess.html');
  })

  /*
   * ipcMan listens for the ipcRenderer to send a download request
   * with the url location of a file to be downloaded. The download
   * is started and once it is complete sends a boolean to represent
   * the success of the download back to the ipcRenderer.
   */ 
  ipcMain.handle('downloadFile', async (event, {url}) => {
    const win = BrowserWindow.getFocusedWindow();
    await download(win, url, {openFolderWhenDone: true});
    return true;
 });

  /*
   * app is listening on the 'window-all-closed' channel for a 
   * message to close all the application windows.
   */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  })
