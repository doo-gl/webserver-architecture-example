

import {Pool} from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import {bookDatabaseConfig} from "../client/config/book-database-config";
import {PostgresPool} from "kysely/dist/esm/dialect/postgres/postgres-dialect-config";
import {BookDatabase} from "./book-database-schema";

const databaseConfig = bookDatabaseConfig.get()
const pool:PostgresPool = new Pool({
  database: databaseConfig.databaseName(),
  host: databaseConfig.host(),
  user: databaseConfig.user(),
  port: databaseConfig.port(),
  max: databaseConfig.maxConnections(),
})

const dialect = new PostgresDialect({
  pool,
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<BookDatabase>({
  dialect,
})