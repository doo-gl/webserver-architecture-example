import {BookDto} from "./book-dto";

export interface PageUpdateRequest {
  id:string,
  pageNumber?:number,
  content?:string,
}

export interface BookUpdateRequest {
  id:string,
  name?:string,
  edition?:string,
  pages?:Array<PageUpdateRequest>
}

const update = async (request:BookUpdateRequest):Promise<BookDto> => {

}

export const bookUpdater = {
  update,
}