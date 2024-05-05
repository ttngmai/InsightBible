const Database = require('better-sqlite3')
const path = require('path')

const getBibleDB = (dbName: string) => {
  const dbPath =
    process.env.NODE_ENV === 'development'
      ? `src/database/bible/${dbName}.db`
      : path.join(process.resourcesPath, `./database/bible/${dbName}.db`)

  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  return db
}

const getCommentaryDB = (dbName: string) => {
  const dbPath =
    process.env.NODE_ENV === 'development'
      ? `src/database/commentary/${dbName}.db`
      : path.join(process.resourcesPath, `./database/commentary/${dbName}.db`)

  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  return db
}

export { getBibleDB, getCommentaryDB }
