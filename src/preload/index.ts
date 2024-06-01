import { contextBridge, ipcRenderer } from 'electron'
import { TFindBible, TFindBibleSoundTimeStamp, TFindCommentary } from '@shared/types.js'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

/**
 * 렌더러 프로세스에서 사용할 수 있는 API를 제한하여,
 * 메인 프로세스의 기능을 안전하게 호출할 수 있도록 함.
 */
try {
  contextBridge.exposeInMainWorld('electron', {
    locale: navigator.language,
    store: {
      get(key) {
        return ipcRenderer.sendSync('electron-store-get', key)
      },
      set(property, val) {
        ipcRenderer.send('electron-store-set', property, val)
      }
    }
  })
  contextBridge.exposeInMainWorld('context', {
    findBible: (...args: Parameters<TFindBible>) => ipcRenderer.invoke('findBible', ...args),
    findBibleSoundTimeStamp: (...args: Parameters<TFindBibleSoundTimeStamp>) =>
      ipcRenderer.invoke('findBibleSoundTimeStamp', ...args),
    findCommentary: (...args: Parameters<TFindCommentary>) =>
      ipcRenderer.invoke('findCommentary', ...args)
  })
} catch (error) {
  console.error(error)
}
