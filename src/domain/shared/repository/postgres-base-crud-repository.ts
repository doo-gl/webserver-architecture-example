
import {Pool, QueryResult} from "pg";
import {BaseTable} from "./base-database-schema";


export class PostgresBaseCrudRepository<TABLE_ROW extends BaseTable> {

  private readonly pool:Pool
  private readonly tableName:string

  constructor(pool:Pool, tableName:string) {
    this.pool = pool;
    this.tableName = tableName
  }

  async getOne(id:string):Promise<TABLE_ROW|null> {
    const result:QueryResult<TABLE_ROW> = await this.pool.query(`
      SELECT *
      FROM ${this.tableName}
      WHERE id = ${id}
      ORDER BY id
      LIMIT 1
    `)
    if (result.rows.length === 0) {
      return null
    }
    return result.rows[0]
  }

  // async getByIds(ids:Array<string>):Promise<Array<T>> {
  //
  // }
  //
  // async getMany(
  //   query:Array<>,
  //   options:,
  // ):Promise<Array<T>> {
  //
  // }
  //
  // async createAndReturn()

}

const bookRepo = new PostgresBaseCrudRepository<BookDatabase, 'book', BookTable>(bookDatabase)