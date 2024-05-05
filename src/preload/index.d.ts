import { TFindAllBibleByBookAndChapter, TFindAllCommentaryByBookAndChapter } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      openBibleSearchPage
      findAllBibleByBookAndChapter: TFindAllBibleByBookAndChapter
      findAllCommentaryByBookAndChapter: TFindAllCommentaryByBookAndChapter
    }
  }
}
