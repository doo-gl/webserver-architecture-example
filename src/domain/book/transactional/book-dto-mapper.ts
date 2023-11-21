import {BookTable, PageTable} from "../repository/schema/book-database-schema";
import {BookDto} from "../component/book-dto";
import {PageDto} from "../component/page-dto";

const mapPage = (pageRow:PageTable):PageDto => {
  return {
    id: pageRow.id,
    pageNumber: pageRow.page_number,
    content: pageRow.content
  }
}

const map = (bookRow:BookTable, pageRows:Array<PageTable>):BookDto => {
  return {
    id: bookRow.id,
    name: bookRow.name,
    edition: bookRow.edition,
    pages: pageRows
      .filter(pageRow => pageRow.book_id === bookRow.id)
      .map(pageRow => mapPage(pageRow))
  }
}

export const bookDtoMapper = {
  map
}