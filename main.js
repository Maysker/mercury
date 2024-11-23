// Import Electron modules
const { app, BrowserWindow } = require('electron');

// Create a variable for the window
let mainWindow;

// Create the window when the application is ready
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    fullscreen: true, // fullscreen mode,
    webPreferences: {
        nodeIntegration: true,
    },
  });

  // Load the home page
  mainWindow.loadFile('home.html');

  // (Optional) Open the developer tools
  // mainWindow.webContents.openDevTools();
});

// Quit the application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, applications usually stay active until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window for macOS if the application is active but no windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
