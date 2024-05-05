import { TFindAllCommentaryByBookAndChapter } from '@shared/types'
import { getCommentaryDB } from './getDB'

export const findAllCommentaryByBookAndChapter: TFindAllCommentaryByBookAndChapter = async (
  book,
  chapter
) => {
  try {
    const db = getCommentaryDB('매튜헨리')

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all()

    return Promise.resolve(rowList)
  } catch (err) {
    console.error(err)
    throw err
  }
}
