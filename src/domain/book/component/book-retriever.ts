import {BookDto} from "./book-dto";

export interface BookRetrieveManyRequest {
  name?:string
  edition?:number,
}

export interface BookRetrieveManyResponse {
  results:Array<BookDto>
}

const retrieve = async (id:string):Promise<BookDto> => {

}

const retrieveMany = async (request:BookRetrieveManyRequest):Promise<BookRetrieveManyResponse> => {

}

export const bookRetriever = {
  retrieve,
  retrieveMany,
}