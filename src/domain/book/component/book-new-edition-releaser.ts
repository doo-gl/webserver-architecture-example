import {PageCreationRequest} from "./book-creator";
import {BookDto} from "./book-dto";


export interface NewEditionReleaseRequest {
  bookId:string,
  edition:number,
  updatedPages:Array<PageCreationRequest>,
}

const release = async (request:NewEditionReleaseRequest):Promise<BookDto> => {
  return {name: '', edition: 1, pages: [], id: ''}
}

export const bookNewEditionReleaser = {
  release,
}
