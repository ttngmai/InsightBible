import { contextBridge, ipcRenderer } from 'electron'
import { TFindAllBibleByBookAndChapter, TFindAllCommentaryByBookAndChapter } from '@shared/types'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

/**
 * 렌더러 프로세스에서 사용할 수 있는 API를 제한하여,
 * 메인 프로세스의 기능을 안전하게 호출할 수 있도록 함.
 */
try {
  contextBridge.exposeInMainWorld('electron', {
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
    locale: navigator.language,
    findAllBibleByBookAndChapter: (...args: Parameters<TFindAllBibleByBookAndChapter>) =>
      ipcRenderer.invoke('findAllBibleByBookAndChapter', ...args),
    findAllCommentaryByBookAndChapter: (...args: Parameters<TFindAllCommentaryByBookAndChapter>) =>
      ipcRenderer.invoke('findAllCommentaryByBookAndChapter', ...args)
  })
} catch (error) {
  console.error(error)
}
