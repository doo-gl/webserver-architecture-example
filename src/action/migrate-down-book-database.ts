import {bookDatabaseMigrator} from "../domain/book/repository/schema/book-database-migrator";
import {logger} from "../domain/shared/client/environment/logger";


bookDatabaseMigrator.migrateDown()
  .then(() => {
    logger.info(`Finished migrating Book Database`)
  })
  .catch((err:any) => {
    logger.error(`Failed to migrate Book Database, ${err.message}`, err)
  })