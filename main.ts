import { app, BrowserWindow, Menu, screen, Tray, ipcMain } from 'electron';
import * as path from 'path';

// Initialize remote module
require('@electron/remote/main').initialize();
require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});
class Main {
  private tray: Tray | null = null;
  private mainWindow: BrowserWindow | null = null;
  private get isMainInstance() {
    return app.requestSingleInstanceLock();
  }
  private get assetPath() {
    return app.isPackaged
      ? path.join(process.resourcesPath, 'dist/assets')
      : './src/assets';
  }
  private get isDev() {
    return process.argv.slice(1).some((val) => val === '--serve');
  }

  constructor() {
    if (this.isMainInstance) {
      this.registerProtocol('signit');
      app.on('ready', () => {
        this.setMainWindow();
        this.setTrayMenu();
      });

      app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (window === null) {
          this.setMainWindow();
        }
      });
      // Quit when all windows are closed.
      app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });
      // Protocol handler for osx
      app.on('open-url', (event, url) => {
        event.preventDefault();
      });

      app.on('second-instance', (e, argv) => {
        // Someone tried to run a second instance, we should focus our window.
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) {
            this.mainWindow.restore();
          }
          this.mainWindow.focus();
        }
      });
    } else {
      app.quit();
    }
  }

  setMainWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width / 2,
      height: size.height / 2,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: this.isDev ? true : false,
        contextIsolation: false, // false if you want to run 2e2 test with Spectron
        enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
      }
    });

    if (this.isDev) {
      this.mainWindow.loadURL('http://localhost:4200');
    } else {
      this.mainWindow.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
    }
    // Open the DevTools.
    this.mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    this.mainWindow.on('close', (event: Event) => {
      event.preventDefault();
      if (this.mainWindow) {
        this.mainWindow.hide();
      }

      return false;
    });
    this.mainWindow.on('minimize', (event: Event) => {
      event.preventDefault();
      if (this.mainWindow) {
        this.mainWindow.hide();
      }
    });
  }

  setTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Check for updates...',
        click: () => {
          if (this.mainWindow) {
            this.mainWindow.show();
          }
        }
      },
      {
        label: 'Exit SignIt',
        click: () => {
          this.mainWindow = null;
          app.exit();
        }
      }
    ]);
    this.tray = new Tray(`${this.assetPath}/images/icons/favicon.png`);
    this.tray.on('click', () => {
      if (this.mainWindow) {
        this.mainWindow.show();
      }
    });
    this.tray.setToolTip('Electron.js App');
    this.tray.setContextMenu(contextMenu);
  }

  async registerProtocol(protocol: string) {
    if (this.isDev && process.platform === 'win32') {
      // Set the path of electron.exe and your app.
      // These two additional parameters are only available on windows.
      // Setting this is required to get this working in dev mode.

      app.setAsDefaultProtocolClient(protocol, process.execPath, [
        path.resolve(process.argv[1]),
        path.resolve(process.argv[2])
      ]);
    } else {
      app.setAsDefaultProtocolClient(protocol);
    }
  }
}

new Main();
