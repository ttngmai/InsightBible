import { TFindBible } from '@shared/types'
import { getBibleDB } from './getDB'
import { TBible } from '@shared/models'

export const findBible: TFindBible = async (name, book, chapter) => {
  try {
    const db = getBibleDB(name)

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TBible[]

    return Promise.resolve(rowList)
  } catch (err) {
    return Promise.resolve([])
  }
}
