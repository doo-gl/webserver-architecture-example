import {BookDto} from "./book-dto";

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


}

export const bookCreator = {
  create,
}