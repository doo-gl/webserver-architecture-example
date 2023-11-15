import {PageCreationRequest} from "./book-creator";
import {BookDto} from "./book-dto";


export interface NewEditionCreationRequest {
  edition:number,
  updatedPages:Array<PageCreationRequest>,
}

const create = async (request:NewEditionCreationRequest):Promise<BookDto> => {

}

export const bookNewEditionCreator = {
  create,
}
