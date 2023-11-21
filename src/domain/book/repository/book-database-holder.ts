import {Pool} from 'pg'
import {Kysely, PostgresDialect} from 'kysely'
import {bookDatabaseConfig} from "../client/config/book-database-config";
import {PostgresPool} from "kysely/dist/esm/dialect/postgres/postgres-dialect-config";
import {BookDatabase} from "./schema/book-database-schema";
import {Database} from "../../shared/repository/base-database-holder";


let database:Database<BookDatabase>|null = null

const buildConnection = ():Database<BookDatabase> => {

  const databaseConfig = bookDatabaseConfig.get()
  const pool = new Pool({
    database: databaseConfig.databaseName(),
    host: databaseConfig.host(),
    user: databaseConfig.user(),
    password: databaseConfig.password(),
    port: databaseConfig.port(),
    max: databaseConfig.maxConnections(),
  })

  const dialect = new PostgresDialect({
    pool: <PostgresPool>pool,
  })

  return {
    kysely: new Kysely<BookDatabase>({
      dialect,
    }),
    pool
  }
}

const get = ():Database<BookDatabase> => {
  if (!database) {
    database = buildConnection()
  }
  return database
}

export const bookDatabaseHolder = {
  get
}