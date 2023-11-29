import {BookUpdateRequest} from "../component/book-updater";
import {BookDto} from "../component/book-dto";
import {BookTable, PageTable} from "../repository/schema/book-database-schema";
import {BatchUpdate, Update} from "../../shared/repository/base-database-schema";
import {bookRepository} from "../repository/book-repository";
import {bookDatabaseHolder} from "../repository/book-database-holder";
import {transactionalBookRetriever} from "./transactional-book-retriever";
import {bookDtoMapper} from "./book-dto-mapper";
import {pageRepository} from "../repository/page-repository";


const update = async (request:BookUpdateRequest):Promise<BookDto> => {

  const bookUpdate:Update<BookTable> = {}
  if (request.name) {
    bookUpdate.name = request.name
  }
  if (request.edition) {
    bookUpdate.edition = request.edition
  }

  const pageUpdates:Array<BatchUpdate<PageTable>> = new Array<BatchUpdate<PageTable>>()
  request.pages?.forEach(page => {
    const pageUpdate:Update<PageTable> = {}
    if (page.pageNumber) {
      pageUpdate.page_number = page.pageNumber
    }
    if (page.content) {
      pageUpdate.content = page.content
    }
    pageUpdates.push({id: page.id, update: pageUpdate})
  })

  const preExistingBook = await transactionalBookRetriever.retrieve(request.id)
  const hasBookUpdates = Object.keys(bookUpdate).length > 0
  const hasPageUpdates = pageUpdates.some(p => Object.keys(p.update).length > 0)
  if (!hasBookUpdates && !hasPageUpdates) {
    return preExistingBook
  }

  const db = bookDatabaseHolder.get()

  const bookDto = await db.runInTransaction<BookDto>(async client => {
    const bookRow = await bookRepository.updateAndReturn(request.id, bookUpdate, {client})
    const pageUpdateResult = await pageRepository.batchUpdate(pageUpdates, {client})
    const pageRows = await pageRepository.getByIds(pageUpdateResult.ids, {client})
    return bookDtoMapper.map(bookRow, pageRows)
  })
  return bookDto
}

export const transactionalBookUpdater = {
  update
}