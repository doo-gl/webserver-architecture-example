import {BaseTable} from "../../shared/repository/base-database-schema";


export interface BookDatabase {
  book:BookTable,
  page:PageTable,
}

export interface BookTable extends BaseTable {
  name:string,
  edition:number,
}

export interface PageTable extends BaseTable {
  book_id:string,
  page_number:number,
  content:string,
}