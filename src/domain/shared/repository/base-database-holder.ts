import {Kysely} from "kysely";
import {Pool} from "pg";


export interface Database<T> {
  kysely:Kysely<T>,
  pool:Pool,
}
