import {BookDto} from "../component/book-dto";
import {bookRepository} from "../repository/book-repository";
import {pageRepository} from "../repository/page-repository";
import {bookDtoMapper} from "./book-dto-mapper";
import {NotFoundError} from "../../shared/component/error/not-found-error";


const retrieve = async (id:string):Promise<BookDto> => {
  const bookRow = await bookRepository.getOne(id)
  if (!bookRow) {
    throw new NotFoundError(`Failed to find Book with id: ${id}`)
  }
  const pageRows = await pageRepository.getMany([{field: "book_id", operation: "=", value: id}])
  return bookDtoMapper.map(bookRow, pageRows)
}

export const transactionalBookRetriever = {
  retrieve
}