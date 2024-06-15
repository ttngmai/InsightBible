/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFindBible, TFindBibleSoundTimeStamp, TFindCommentary } from '@shared/types'

declare global {
  interface Window {
    electron: {
      locale: string
      store: {
        get: (key: string) => any
        set: (key: string, value: any) => void
      }
      copyText: (selectedText: string) => void
    }
    context: {
      findBible: TFindBible
      findBibleSoundTimeStamp: TFindBibleSoundTimeStamp
      findCommentary: TFindCommentary
    }
  }
}
