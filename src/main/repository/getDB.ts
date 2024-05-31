import BetterSqlite3 from 'better-sqlite3'
import path from 'path'

export const getBibleDB = (dbName: string): BetterSqlite3.Database => {
  const dbPath =
    process.env.NODE_ENV === 'development'
      ? `src/database/bible/${dbName}.db`
      : path.join(process.resourcesPath, `./database/bible/${dbName}.db`)

  const db = new BetterSqlite3(dbPath)
  db.pragma('journal_mode = WAL')

  return db
}

export const getBibleSoundTimeStampDB = (dbName: string): BetterSqlite3.Database => {
  const dbPath =
    process.env.NODE_ENV === 'development'
      ? `src/database/sound/${dbName}.db`
      : path.join(process.resourcesPath, `./database/sound/${dbName}.db`)

  const db = new BetterSqlite3(dbPath)
  db.pragma('journal_mode = WAL')

  return db
}

export const getCommentaryDB = (dbName: string): BetterSqlite3.Database => {
  const dbPath =
    process.env.NODE_ENV === 'development'
      ? `src/database/commentary/${dbName}.db`
      : path.join(process.resourcesPath, `./database/commentary/${dbName}.db`)

  const db = new BetterSqlite3(dbPath)
  db.pragma('journal_mode = WAL')

  return db
}
