import {BookCreationRequest} from "../component/book-creator";
import {BookDto} from "../component/book-dto";


const persist = async (request:BookCreationRequest):Promise<BookDto> => {
  // open transaction
  // save book
  // read ID
  // save pages with book ID
  // close transaction
}

export const transactionalBookPersister = {
  persist
}