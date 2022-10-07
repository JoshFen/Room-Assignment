const { app, BrowserWindow } = require('electron')
const { readExcel } = require('./fileReader')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600  })
  
    win.loadFile('src/index.html')
  }

  app.whenReady().then(() => {
    createWindow()
    readExcel()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
