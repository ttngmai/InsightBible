import { TFindAllCommentaryByBookAndChapter } from '@shared/types'
import { getCommentaryDB } from './getDB'
import { TCommentary } from '@shared/models'

export const findAllCommentaryByBookAndChapter: TFindAllCommentaryByBookAndChapter = async (
  book,
  chapter
) => {
  try {
    const db = getCommentaryDB('매튜헨리')

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TCommentary[]

    return Promise.resolve(rowList)
  } catch (err) {
    console.error(err)
    throw err
  }
}
