import {PageDto} from "./page-dto";


export interface BookDto {
  id:string,
  name:string,
  edition:number,
  pages:Array<PageDto>,
}