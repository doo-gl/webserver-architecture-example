import {Kysely} from "kysely";
import {Client, Pool} from "pg";


export interface Database<T> {
  kysely:Kysely<T>,
  pool:Pool,
  buildClient:() => Client,
  runInTransaction: <T>(action:(client:Client) => Promise<T>) => Promise<T>
}
