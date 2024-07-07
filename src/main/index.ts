import { app, shell, BrowserWindow, ipcMain, clipboard } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { TFindBible, TFindBibleSoundTimeStamp } from '@shared/types.js'
import { findBible } from '@/repository/BibleRepository.js'
import Store from 'electron-store'
import { fileURLToPath } from 'url'
import { findBibleSoundTimeStamp } from './repository/BibleSoundTimeStampRepository.js'
import path from 'path'

const store = new Store()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: '보는 성경',
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(fileURLToPath(new URL('../renderer/index.html', import.meta.url)))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('electron-store-get', async (event, val) => {
    event.returnValue = store.get(val)
  })
  ipcMain.on('electron-store-set', async (_, key, val) => {
    store.set(key, val)
  })
  ipcMain.on('copy-text', (_, selectedText) => {
    clipboard.writeText(selectedText)
  })
  ipcMain.handle('findBible', (_, ...args: Parameters<TFindBible>) => findBible(...args))
  ipcMain.handle('findBibleSoundTimeStamp', (_, ...args: Parameters<TFindBibleSoundTimeStamp>) =>
    findBibleSoundTimeStamp(...args)
  )
  ipcMain.handle('getAudioFilePath', (_, fileName) => {
    const filePath =
      process.env.NODE_ENV === 'development'
        ? `src/audios/${fileName}`
        : path.join(process.resourcesPath, `./audios/${fileName}`)
    return filePath
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
