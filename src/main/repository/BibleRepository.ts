import { TFindAllBibleByBookAndChapter } from '@shared/types'
import { getBibleDB } from './getDB'
import { TBible } from '@shared/models'

export const findAllBibleByBookAndChapter: TFindAllBibleByBookAndChapter = async (
  book,
  chapter
) => {
  try {
    const db = getBibleDB('개역개정')

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TBible[]

    return Promise.resolve(rowList)
  } catch (err) {
    console.error(err)
    throw err
  }
}
