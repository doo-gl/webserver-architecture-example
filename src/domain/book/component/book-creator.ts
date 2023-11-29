import {BookDto} from "./book-dto";
import {transactionalBookPersister} from "../transactional/transactional-book-persister";

export interface PageCreationRequest {
  pageNumber:number,
  content:string,
}

export interface BookCreationRequest {
  name:string,
  edition:number,
  pages:Array<PageCreationRequest>,
}

const create = async (request:BookCreationRequest):Promise<BookDto> => {

  const book = await transactionalBookPersister.persist(request)
  // todo send book created event
  return book
}

export const bookCreator = {
  create,
}