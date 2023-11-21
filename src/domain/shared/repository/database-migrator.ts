import {FileMigrationProvider, Kysely, MigrationResultSet, Migrator} from "kysely";
import {logger} from "../client/environment/logger";
import {readdir} from "fs/promises";
import {join} from "path";

const buildMigrator = <T>(database:Kysely<T>, migrationFolder:string):Migrator => {
  return new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs: {readdir},
      path: {join},
      // This needs to be an absolute path.
      migrationFolder,
    }),
  })
}

const handleMigrationResult = async <T>(database:Kysely<T>, resultSet:MigrationResultSet):Promise<void> => {
  const results = resultSet.results
  const error:any = resultSet.error

  results?.forEach((it) => {
    if (it.status === 'Success') {
      logger.info(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      logger.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    logger.error(`Failed to migrate: ${error.message}`, error)
    process.exit(1)
  }

  await database.destroy()
}

const migrateUp = async <T>(database:Kysely<T>, migrationFolder:string):Promise<void> => {

  const migrator = buildMigrator(database, migrationFolder)
  const migrationResult = await migrator.migrateUp()
  await handleMigrationResult(
    database,
    migrationResult
  )
}

const migrateDown = async <T>(database:Kysely<T>, migrationFolder:string):Promise<void> => {
  const migrator = buildMigrator(database, migrationFolder)
  const migrationResult = await migrator.migrateDown()
  await handleMigrationResult(
    database,
    migrationResult
  )
}

const migrateToLatest = async <T>(database:Kysely<T>, migrationFolder:string):Promise<void> => {
  const migrator = buildMigrator(database, migrationFolder)
  const migrationResult = await migrator.migrateToLatest()
  await handleMigrationResult(
    database,
    migrationResult
  )
}

export const databaseMigrator = {
  migrateUp,
  migrateDown,
  migrateToLatest,
}