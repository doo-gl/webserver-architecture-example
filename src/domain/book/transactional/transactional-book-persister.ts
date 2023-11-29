import {BookCreationRequest} from "../component/book-creator";
import {BookDto} from "../component/book-dto";
import {bookRepository} from "../repository/book-repository";
import {bookDatabaseHolder} from "../repository/book-database-holder";
import {pageRepository} from "../repository/page-repository";
import {bookDtoMapper} from "./book-dto-mapper";


const persist = async (request:BookCreationRequest):Promise<BookDto> => {
  const db = bookDatabaseHolder.get()

  const bookDto = await db.runInTransaction<BookDto>(async client => {

    const book = await bookRepository.createAndReturn(
      {
        name: request.name,
        edition: request.edition,
      },
      {
        client
      }
    )

    const newPageIds = await pageRepository.batchCreate(
      request.pages.map(page => ({
        book_id: book.id,
        page_number: page.pageNumber,
        content: page.content
      })),
      {
        client
      }
    )
    const pages = await pageRepository.getByIds(newPageIds, {client})

    return bookDtoMapper.map(book, pages)
  })

  return bookDto
}

export const transactionalBookPersister = {
  persist
}