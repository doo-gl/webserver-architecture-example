import {BookDto} from "../component/book-dto";
import {bookDatabaseHolder} from "../repository/book-database-holder";
import {Kysely} from "kysely";
import {BookDatabase} from "../repository/schema/book-database-schema";
import {uuid} from "../../shared/client/external-lib/uuid";


const retrieve = async (id:string):Promise<BookDto> => {
  const db:Kysely<BookDatabase> = bookDatabaseHolder.get()
  await db.insertInto('book')
    .values({
      name: 'foo',
      edition: 1,
      id: uuid(),
      date_created: new Date(),
      date_last_modified: new Date()
    })
    .execute()

  const bookRow = await db.selectFrom('book')
    .innerJoin('page', 'page.book_id', 'book.id')

    // .where('book.name', '=', 'foo')
    // .executeTakeFirst()

  return bookRow
}

export const transactionalBookRetriever = {
  retrieve
}