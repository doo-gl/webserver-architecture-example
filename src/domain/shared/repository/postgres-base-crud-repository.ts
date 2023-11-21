
import {Pool, QueryResult} from "pg";
import {BaseTable} from "./base-database-schema";
import {logger} from "../client/environment/logger";
import {NotFoundError} from "../component/error/not-found-error";

type QueryOperation = '='|'!='

export interface Query<T> {
  field:Extract<keyof T, string>|string,
  operation:QueryOperation,
  value:any
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Sort<T> {
  field:Extract<keyof T, string>|string,
  order:SortOrder,
}

export interface QueryOptions<T> {
  limit?:number,
  sort?:Array<Sort<T>>,
}

export class PostgresBaseCrudRepository<TABLE_ROW extends BaseTable> {

  private readonly pool:Pool
  private readonly tableName:string

  constructor(pool:Pool, tableName:string) {
    this.pool = pool;
    this.tableName = tableName
  }

  async getOne(id:string):Promise<TABLE_ROW|null> {
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE id = $1
      ORDER BY id
      LIMIT 1
    `
    try {
      const result:QueryResult<TABLE_ROW> = await this.pool.query(query, [id])
      if (result.rows.length === 0) {
        return null
      }
      return result.rows[0]
    } catch (err:any) {
      if (err.severity === 'ERROR' && err.code === '22P02') { // id was not of type uuid
        throw new NotFoundError(`Failed to find ${this.tableName} with id: ${id}`)
      }
      throw err
    }
  }

  async getMany(
    queries:Array<Query<TABLE_ROW>>,
    queryOptions:QueryOptions<TABLE_ROW>|null = null
  ):Promise<Array<TABLE_ROW>> {
    if (queries.length === 0) {
      logger.warn(`Query with no params on ${this.tableName}`)
    }

    let whereClause = '1 = 1'
    const params = new Array<any>()
    queries.forEach((query:Query<TABLE_ROW>) => {
      params.push(query.value)
      const newClauseSuffix = `(${query.field} ${query.operation} $${params.length})`
      whereClause = `${whereClause} AND ${newClauseSuffix}`
    })

    let orderClause = ''
    if (queryOptions && queryOptions.sort && queryOptions.sort.length > 0) {
      orderClause = 'ORDER BY'
      queryOptions.sort.forEach(sort => {
        orderClause = `${orderClause} ${sort.field} ${sort.order}`
      });
    }

    let limitClause = ''
    if (queryOptions && queryOptions.limit) {
      limitClause = `LIMIT ${queryOptions.limit}`
    }

    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE ${whereClause}
      ${orderClause}
      ${limitClause}
    `
    const result:QueryResult<TABLE_ROW> = await this.pool.query(
      query,
      params,
    )
    return result.rows
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
