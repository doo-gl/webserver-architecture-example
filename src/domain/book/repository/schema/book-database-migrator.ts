import {join} from 'path'
import {databaseMigrator} from "../../../shared/repository/database-migrator";
import {bookDatabaseHolder} from "../book-database-holder";


const migrateUp = async ():Promise<void> => {
  await databaseMigrator.migrateUp(bookDatabaseHolder.get().kysely, join(__dirname, 'migration'))
}
const migrateDown = async ():Promise<void> => {
  await databaseMigrator.migrateDown(bookDatabaseHolder.get().kysely, join(__dirname, 'migration'))
}
const migrateToLatest = async ():Promise<void> => {
  await databaseMigrator.migrateToLatest(bookDatabaseHolder.get().kysely, join(__dirname, 'migration'))
}

export const bookDatabaseMigrator = {
  migrateToLatest,
  migrateUp,
  migrateDown,
}