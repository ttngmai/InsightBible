import { TBible, TBibleSoundTimeStamp, TCommentary } from './models.js'

export type TFindBible = (name: string, book: number, chapter: number) => Promise<TBible[]>

export type TReadingRange = {
  startBook: number
  startChapter: number
  endBook: number
  endChapter: number
}

export type TFindBibleSoundTimeStamp = (
  name: string,
  book: number,
  chapter: number
) => Promise<TBibleSoundTimeStamp[]>

export type TFindCommentary = (
  name: string,
  book: number,
  chapter: number
) => Promise<TCommentary[]>
