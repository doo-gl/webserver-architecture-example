import {PostgresBaseCrudRepository} from "../../shared/repository/postgres-base-crud-repository";
import {bookDatabaseHolder} from "./book-database-holder";
import {BookTable} from "./schema/book-database-schema";


export const bookRepository = new PostgresBaseCrudRepository<BookTable>(
  bookDatabaseHolder.get().pool,
  'book'
)