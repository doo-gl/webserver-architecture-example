

import {Kysely, sql} from 'kysely'

export const up = async (db: Kysely<any>):Promise<void> => {
  // ensure the Database has the native UUID generating functions
  // see https://stackoverflow.com/questions/12505158/generating-a-uuid-in-postgres-for-insert-statement
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db)

  await db.schema
    .createTable('book')
    .addColumn('id', 'uuid', (col) =>
      col.defaultTo(sql`UUID_GENERATE_V4()`).primaryKey()
    )
    .addColumn('date_created', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('date_last_modified', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('edition', 'integer', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('page')
    .addColumn('id', 'uuid', (col) =>
      col.defaultTo(sql`UUID_GENERATE_V4()`).primaryKey()
    )
    .addColumn('date_created', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('date_last_modified', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('book_id', 'uuid', (col) =>
      col.references('book.id').onDelete('cascade').notNull()
    )
    .addColumn('edition', 'integer', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('idx__book__name')
    .on('book')
    .column('name')
    .execute()
  await db.schema
    .createIndex('idx__book__edition')
    .on('book')
    .column('edition')
    .execute()
}

export const down = async (db: Kysely<any>):Promise<void> => {
  await db.schema.dropTable('page').execute()
  await db.schema.dropTable('book').execute()
}