import {BookDto} from "../component/book-dto";
import {BookRetrieveManyRequest, BookRetrieveManyResponse, bookRetriever} from "../component/book-retriever";
import {BookCreationRequest, bookCreator} from "../component/book-creator";
import {bookUpdater, BookUpdateRequest} from "../component/book-updater";
import {bookNewEditionReleaser, NewEditionReleaseRequest} from "../component/book-new-edition-releaser";


const getBook = async (id:string):Promise<BookDto> => {
  return bookRetriever.retrieve(id)
}

const getBooks = async (request:BookRetrieveManyRequest):Promise<BookRetrieveManyResponse> => {
  return bookRetriever.retrieveMany(request)
}

const updateBook = async (request:BookUpdateRequest):Promise<BookDto> => {
  return bookUpdater.update(request)
}

const createBook = async (request:BookCreationRequest):Promise<BookDto> => {
  return bookCreator.create(request)
}

const releaseNewBookEdition = async (request:NewEditionReleaseRequest):Promise<BookDto> => {
  return bookNewEditionReleaser.release(request)
}

export const bookService = {
  getBook,
  getBooks,
  updateBook,
  createBook,
  releaseNewBookEdition
}