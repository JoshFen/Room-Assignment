/* app is our electron application we are grabbing from the 
 * electron library, along with the BrowserWindow object used to
 * create our application window and the the ipcMain object that
 * is used to communicate with the ipcRenderer.
 */ 
const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');

/* 
 * Creates the display window with the assigned dimensions
 * and html file.
 */
const createWindow = () => {
    // 'win' is a variable set to an instance of BrowserWindow
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: join(__dirname, 'preload.js')
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
    console.log(data);
    return {isLoading: true};
  })
  
  /*
   * app is listening on the 'window-all-closed' channel for a 
   * message to close all the application windows.
   */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  })
