/* contextBridge allows the ipcRenderer and ipcMain
 * to communicate with one another. Sending messages 
 * in order to trigger UI changes, and main processes
 * such as room assignment.
 */
const { contextBridge, ipcRenderer } = require('electron');
const { join } = require('path');
// Use the contextBridge to create an 'api' channel 
contextBridge.exposeInMainWorld('api', {
    // 'uploadFile' sub-channel sends data from renderer to main
    uploadFile: (data) => ipcRenderer.send('uploadFile', data),
    // 'sendLLCInfo' sub-channel sends data about LLC names and floors
    sendLLCInfo: (data) => ipcRenderer.send('sendLLCInfo', data), 
    // 'runAssignment' sub-channel starts the room assignment process
    runAssignment: () => ipcRenderer.invoke('runAssignment'),
    // 'downloadFile' sub-channel allows for result file to be downloaded
    downloadFile: () => ipcRenderer.send('downloadFile'),
    downloadComplete: (data) => { ipcRenderer.addListener('downloadComplete', data) },
    // 'triggerPopup' sub-channel opens a confirmation popup
    triggerPopup: (data) => ipcRenderer.invoke('triggerPopup', data),
    // 'cancelRun' sub-channel cancels the room assignment process before it runs
    cancelRun: (data) => ipcRenderer.send('cancelRun', data),
    // 'changePageToPreprocess' sub-channel changes the current window's displayed html page to preprocess.html
    changePageToPreprocess: () => ipcRenderer.addListener('changePageToPreprocess', () => window.location.href = 'views/preprocess.html'),
    // 'changePageToPostprocess' sub-channel changes the current window's displayed html page to postprocess.html
    changePageToPostprocess: () => ipcRenderer.addListener('changePageToPostprocess', () => window.location.href = 'postprocess.html'),
    // 'LLCInfoError' sub-channel sends a message that the user LLC input does not match with the excel sheet
    LLCInfoError : () => ipcRenderer.addListener('LLCInfoError', () => document.getElementById('errorMessage').hidden = false),
    // 'closeErrorPopup' sub-channel closes an error popup window and returns focus to the parent window
    closeErrorPopup: () => ipcRenderer.send('closeErrorPopup'),
    // 'close' sub-channel closes the application
    close: () => ipcRenderer.send('close'),
    // 'minimize sub-channel minimizes the application
    minimize: () => ipcRenderer.send('minimize')
})