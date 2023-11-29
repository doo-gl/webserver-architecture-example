import {BookDto} from "./book-dto";
import {transactionalBookRetriever} from "../transactional/transactional-book-retriever";

export interface BookRetrieveManyRequest {
  name?:string
  edition?:number,
}

export interface BookRetrieveManyResponse {
  results:Array<BookDto>
}

const retrieve = async (id:string):Promise<BookDto> => {
  return transactionalBookRetriever.retrieve(id)
}

const retrieveMany = async (request:BookRetrieveManyRequest):Promise<BookRetrieveManyResponse> => {
  return transactionalBookRetriever.retrieveMany(request)
}

export const bookRetriever = {
  retrieve,
  retrieveMany,
}