import { TFindCommentary } from '@shared/types'
import { getCommentaryDB } from './getDB'
import { TCommentary } from '@shared/models'

export const findCommentary: TFindCommentary = async (name, book, chapter) => {
  try {
    const db = getCommentaryDB(name)

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TCommentary[]

    return Promise.resolve(rowList)
  } catch (err) {
    return Promise.resolve([])
  }
}
