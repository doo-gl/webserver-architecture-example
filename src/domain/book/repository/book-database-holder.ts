import {Pool} from 'pg'
import {Kysely, PostgresDialect} from 'kysely'
import {bookDatabaseConfig} from "../client/config/book-database-config";
import {PostgresPool} from "kysely/dist/esm/dialect/postgres/postgres-dialect-config";
import {BookDatabase} from "./schema/book-database-schema";


let database:Kysely<BookDatabase>|null = null

const buildConnection = () => {

  const databaseConfig = bookDatabaseConfig.get()
  const pool:PostgresPool = new Pool({
    database: databaseConfig.databaseName(),
    host: databaseConfig.host(),
    user: databaseConfig.user(),
    password: databaseConfig.password(),
    port: databaseConfig.port(),
    max: databaseConfig.maxConnections(),
  })

  const dialect = new PostgresDialect({
    pool,
  })

  return new Kysely<BookDatabase>({
    dialect,
  })
}

const get = ():Kysely<BookDatabase> => {
  if (!database) {
    database = buildConnection()
  }
  return database
}

export const bookDatabaseHolder = {
  get
}