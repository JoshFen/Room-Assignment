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
    downloadFile: (data) => ipcRenderer.invoke('downloadFile', {url: join(__dirname, '../assets/close-icon.svg')}),
    downloadComplete: (data) => { console.log(data); ipcRenderer.addListener('downloadComplete', data)}
})