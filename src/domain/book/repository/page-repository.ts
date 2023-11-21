import {PostgresBaseCrudRepository} from "../../shared/repository/postgres-base-crud-repository";
import {bookDatabaseHolder} from "./book-database-holder";
import {PageTable} from "./schema/book-database-schema";


export const pageRepository = new PostgresBaseCrudRepository<PageTable>(
  bookDatabaseHolder.get().pool,
  'page'
)