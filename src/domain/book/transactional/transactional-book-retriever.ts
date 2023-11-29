import {BookDto} from "../component/book-dto";
import {bookRepository} from "../repository/book-repository";
import {pageRepository} from "../repository/page-repository";
import {bookDtoMapper} from "./book-dto-mapper";
import {NotFoundError} from "../../shared/component/error/not-found-error";
import {BookRetrieveManyRequest, BookRetrieveManyResponse} from "../component/book-retriever";
import {Query} from "../../shared/repository/postgres-base-crud-repository";
import {BookTable, PageTable} from "../repository/schema/book-database-schema";


const retrieve = async (id:string):Promise<BookDto> => {
  const bookRow = await bookRepository.getOne(id)
  if (!bookRow) {
    throw new NotFoundError(`Failed to find Book with id: ${id}`)
  }
  const pageRows = await pageRepository.getMany([{field: "book_id", operation: "=", value: id}])
  return bookDtoMapper.map(bookRow, pageRows)
}

const retrieveMany = async (request:BookRetrieveManyRequest):Promise<BookRetrieveManyResponse> => {

  const queries = new Array<Query<BookTable>>()
  if (request.name) {
    queries.push({field: "name", operation: "==", value: request.name})
  }
  if (request.edition) {
    queries.push({field: "edition", operation: "==", value: request.edition})
  }

  const bookRows = await bookRepository.getMany(queries)
  const pageRows = await pageRepository.getMany([{field: "book_id", operation: "in-array", value: bookRows.map(b => b.id)}])

  const bookIdToPages = new Map<string, Array<PageTable>>()
  pageRows.forEach(page => {
    const pages = bookIdToPages.get(page.book_id) ?? new Array<PageTable>()
    pages.push(page)
    bookIdToPages.set(page.book_id, pages)
  })

  const books = new Array<BookDto>()
  bookRows.forEach(book => {
    const pages = bookIdToPages.get(book.id) ?? new Array<PageTable>()
    books.push(bookDtoMapper.map(book, pages))
  })

  return {results: books}
}

export const transactionalBookRetriever = {
  retrieve,
  retrieveMany,
}