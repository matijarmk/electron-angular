"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
// Initialize remote module
require('@electron/remote/main').initialize();
require('electron-reload')(__dirname, {
    electron: require(__dirname + "/node_modules/electron")
});
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.tray = null;
        this.mainWindow = null;
        if (this.isMainInstance) {
            this.registerProtocol('signit');
            electron_1.app.on('ready', function () {
                _this.setMainWindow();
                _this.setTrayMenu();
            });
            electron_1.app.on('activate', function () {
                // On OS X it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (window === null) {
                    _this.setMainWindow();
                }
            });
            // Quit when all windows are closed.
            electron_1.app.on('window-all-closed', function () {
                // On OS X it is common for applications and their menu bar
                // to stay active until the user quits explicitly with Cmd + Q
                if (process.platform !== 'darwin') {
                    electron_1.app.quit();
                }
            });
            // Protocol handler for osx
            electron_1.app.on('open-url', function (event, url) {
                event.preventDefault();
            });
            electron_1.app.on('second-instance', function (e, argv) {
                // Someone tried to run a second instance, we should focus our window.
                if (_this.mainWindow) {
                    if (_this.mainWindow.isMinimized()) {
                        _this.mainWindow.restore();
                    }
                    _this.mainWindow.focus();
                }
            });
        }
        else {
            electron_1.app.quit();
        }
    }
    Object.defineProperty(Main.prototype, "isMainInstance", {
        get: function () {
            return electron_1.app.requestSingleInstanceLock();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "assetPath", {
        get: function () {
            return electron_1.app.isPackaged
                ? path.join(process.resourcesPath, 'dist/assets')
                : './src/assets';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "isDev", {
        get: function () {
            return process.argv.slice(1).some(function (val) { return val === '--serve'; });
        },
        enumerable: false,
        configurable: true
    });
    Main.prototype.setMainWindow = function () {
        var _this = this;
        var size = electron_1.screen.getPrimaryDisplay().workAreaSize;
        // Create the browser window.
        this.mainWindow = new electron_1.BrowserWindow({
            x: 0,
            y: 0,
            width: size.width / 2,
            height: size.height / 2,
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: this.isDev ? true : false,
                contextIsolation: false,
                enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
            }
        });
        if (this.isDev) {
            this.mainWindow.loadURL('http://localhost:4200');
        }
        else {
            this.mainWindow.loadURL("file://" + path.join(__dirname, 'dist/index.html'));
        }
        // Open the DevTools.
        this.mainWindow.webContents.openDevTools();
        // Emitted when the window is closed.
        this.mainWindow.on('close', function (event) {
            event.preventDefault();
            if (_this.mainWindow) {
                _this.mainWindow.hide();
            }
            return false;
        });
        this.mainWindow.on('minimize', function (event) {
            event.preventDefault();
            if (_this.mainWindow) {
                _this.mainWindow.hide();
            }
        });
    };
    Main.prototype.setTrayMenu = function () {
        var _this = this;
        var contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: 'Check for updates...',
                click: function () {
                    if (_this.mainWindow) {
                        _this.mainWindow.show();
                    }
                }
            },
            {
                label: 'Exit SignIt',
                click: function () {
                    _this.mainWindow = null;
                    electron_1.app.exit();
                }
            }
        ]);
        this.tray = new electron_1.Tray(this.assetPath + "/images/icons/favicon.png");
        this.tray.on('click', function () {
            if (_this.mainWindow) {
                _this.mainWindow.show();
            }
        });
        this.tray.setToolTip('Electron.js App');
        this.tray.setContextMenu(contextMenu);
    };
    Main.prototype.registerProtocol = function (protocol) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isDev && process.platform === 'win32') {
                    // Set the path of electron.exe and your app.
                    // These two additional parameters are only available on windows.
                    // Setting this is required to get this working in dev mode.
                    electron_1.app.setAsDefaultProtocolClient(protocol, process.execPath, [
                        path.resolve(process.argv[1]),
                        path.resolve(process.argv[2])
                    ]);
                }
                else {
                    electron_1.app.setAsDefaultProtocolClient(protocol);
                }
                return [2 /*return*/];
            });
        });
    };
    return Main;
}());
new Main();
//# sourceMappingURL=main.js.map