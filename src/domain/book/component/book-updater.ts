import {BookDto} from "./book-dto";

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
  return {name: '', edition: 1, pages: [], id: ''}
}

export const bookUpdater = {
  update,
}