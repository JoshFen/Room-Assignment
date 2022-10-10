/* contextBridge allows the ipcRenderer and ipcMain
 * to communicate with one another. Sending messages 
 * in order to trigger UI changes, and main processes
 * such as room assignment.
 */
const { contextBridge, ipcRenderer } = require('electron');

// Use the contextBridge to create an 'api' channel 
contextBridge.exposeInMainWorld('api', {
    // 'uploadFile' sub-channel sends data from renderer to main
    uploadFile: (data) => ipcRenderer.invoke('uploadFile', data),
})