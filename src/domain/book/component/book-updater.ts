import {BookDto} from "./book-dto";
import {transactionalBookRetriever} from "../transactional/transactional-book-retriever";
import {NotFoundError} from "../../shared/component/error/not-found-error";
import {transactionalBookUpdater} from "../transactional/transactional-book-updater";

export interface PageUpdateRequest {
  id:string,
  pageNumber?:number,
  content?:string,
}

export interface BookUpdateRequest {
  id:string,
  name?:string,
  edition?:number,
  pages?:Array<PageUpdateRequest>
}

const update = async (request:BookUpdateRequest):Promise<BookDto> => {

  const preExistingBook = await transactionalBookRetriever.retrieve(request.id)
  if (!preExistingBook) {
    throw new NotFoundError(`Failed to find book with Id: ${request.id}`)
  }

  const preExistingPages = preExistingBook.pages
  const pageIds = new Set<string>(preExistingPages.map(p => p.id) ?? new Array<string>())
  const nonExistingPages:Array<PageUpdateRequest> = request.pages?.filter((p:PageUpdateRequest) => !pageIds.has(p.id))
  if (nonExistingPages.length > 0) {
    throw new NotFoundError(`Book does not have pages: ${nonExistingPages.join(', ')}`)
  }

  const hasBookUpdates = request.name || request.edition
  const hasPageUpdates = request.pages && request.pages.some(p => p.pageNumber || p.content)
  if (!hasBookUpdates && !hasPageUpdates) {
    return preExistingBook
  }

  const updatedBook = await transactionalBookUpdater.update(request)

  // todo send kafka event

  return updatedBook
}

export const bookUpdater = {
  update,
}