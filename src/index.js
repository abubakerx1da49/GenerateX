const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const path = require('path');
let { download } = require('electron-dl')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 530,
    minWidth: 800,
    minHeight: 530,
    maxWidth: 800,
    maxHeight: 530,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
    maximizable: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

};

ipcMain.on('quit-app', (event) => {
  app.quit()
})

ipcMain.on('minimize-app', (event) => {
  BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('reload-app', (event) => {
  BrowserWindow.getFocusedWindow().reload()
})

ipcMain.on('maximize-app', (event) => {
  let icon = ""
  if (BrowserWindow.getFocusedWindow().isMaximized()) {
    BrowserWindow.getFocusedWindow().unmaximize()
    icon = "Max"
  } else {
    BrowserWindow.getFocusedWindow().maximize()
    icon = "UnMax"
  }

})

// IPC Main to Download an Image File
ipcMain.on('download-img', (event, { payload }) => {

  dialog.showSaveDialog({
    title: 'Save Image - GenerateX',
    buttonLabel: 'Save',
    // Restricting the user to only Text Files.
    filters: [
      {
        name: 'PNG File',
        extensions: ['png']
      },],
    properties: []
  }).then(file => {
    // Stating whether dialog operation was cancelled or not.
    console.log(file.canceled);
    if (!file.canceled) {
      console.log(file.filePath.toString());

      // Creating and Writing to the sample.html file
      // fs.writeFile(file.filePath.toString(), text, function (err) {
      //   if (err) throw err;
      //   console.log('Saved!');
      // });
      console.log(BrowserWindow.getFocusedWindow())
      console.log(payload.url)
      try {
        download(BrowserWindow.getFocusedWindow(), payload.url, { directory: file.filePath.toString() }).then(
          console.log("Downloaded")
        )
      } catch (error) {
        console.log("Error: \n")
        console.log(error)
      }

    }
  }).catch(err => {
    console.log(err)
  });


})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('ready', () => {
  globalShortcut.register('Ctrl+Shift+I', () => {
    console.log('Ctrl+Shift+I is pressed')
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
