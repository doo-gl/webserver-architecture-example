import {Client, Pool} from 'pg'
import {Kysely, PostgresDialect} from 'kysely'
import {bookDatabaseConfig} from "../client/config/book-database-config";
import {PostgresPool} from "kysely/dist/esm/dialect/postgres/postgres-dialect-config";
import {BookDatabase} from "./schema/book-database-schema";
import {Database} from "../../shared/repository/base-database-holder";


let database:Database<BookDatabase>|null = null

const buildClient = ():Client => {
  const databaseConfig = bookDatabaseConfig.get()
  const client = new Client({
    database: databaseConfig.databaseName(),
    host: databaseConfig.host(),
    user: databaseConfig.user(),
    password: databaseConfig.password(),
    port: databaseConfig.port(),
  })
  return client
}

const runInTransaction = async <T>(action:(client:Client) => Promise<T>):Promise<T> => {
  const client = buildClient()
  try {
    await client.connect()
    return await action(client)
  } catch (err:any) {
    throw err
  } finally {
    await client.end()
  }
}

const buildDatabase = ():Database<BookDatabase> => {

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
  const kysely = new Kysely<BookDatabase>({
    dialect,
  })
  return {
    kysely,
    pool,
    buildClient,
    runInTransaction,
  }
}

const get = ():Database<BookDatabase> => {
  if (!database) {
    database = buildDatabase()
  }
  return database
}

export const bookDatabaseHolder = {
  get
}