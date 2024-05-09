/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFindAllBibleByBookAndChapter, TFindAllCommentaryByBookAndChapter } from '@shared/types'

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any
        set: (key: string, value: any) => void
      }
    }
    context: {
      locale: string
      findAllBibleByBookAndChapter: TFindAllBibleByBookAndChapter
      findAllCommentaryByBookAndChapter: TFindAllCommentaryByBookAndChapter
    }
  }
}
