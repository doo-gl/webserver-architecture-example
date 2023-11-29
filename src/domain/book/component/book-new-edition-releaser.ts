import {bookCreator, PageCreationRequest} from "./book-creator";
import {BookDto} from "./book-dto";
import {bookRetriever} from "./book-retriever";


export interface NewEditionReleaseRequest {
  bookId:string,
  edition:number,
  updatedPages:Array<PageCreationRequest>,
}

const release = async (request:NewEditionReleaseRequest):Promise<BookDto> => {


  const oldEditionBook = await bookRetriever.retrieve(request.bookId)
  const nextEdition = request.edition
  const booksWithNextEdition = await bookRetriever.retrieveMany({name: oldEditionBook.name, edition: nextEdition})
  if (booksWithNextEdition.results.length > 0) {
    return booksWithNextEdition.results[0]
  }
  const newEdition = await bookCreator.create({
    name: oldEditionBook.name,
    edition: nextEdition,
    pages: request.updatedPages,
  })

  return newEdition
}

export const bookNewEditionReleaser = {
  release,
}
