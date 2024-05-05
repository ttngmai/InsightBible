import { TBible, TCommentary } from './models'

export type TFindAllBibleByBookAndChapter = (book: number, chapter: number) => Promise<TBible[]>
export type TFindAllCommentaryByBookAndChapter = (
  book: number,
  chapter: number
) => Promise<TCommentary[]>
