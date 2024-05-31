import { TFindBibleSoundTimeStamp } from '@shared/types'
import { getBibleSoundTimeStampDB } from './getDB'
import { TBibleSoundTimeStamp } from '@shared/models'

export const findBibleSoundTimeStamp: TFindBibleSoundTimeStamp = async (name, book, chapter) => {
  try {
    const db = getBibleSoundTimeStampDB(name)

    const query = `SELECT * FROM timestamps WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TBibleSoundTimeStamp[]

    return Promise.resolve(rowList)
  } catch (err) {
    return Promise.resolve([])
  }
}
