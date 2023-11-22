
import {Pool, PoolClient, QueryResult} from "pg";
import {BaseTable, Create} from "./base-database-schema";
import {logger} from "../client/environment/logger";
import {NotFoundError} from "../component/error/not-found-error";
import {UnexpectedError} from "../component/error/unexpected-error";

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

export interface QueryOptions {
  client?:PoolClient,
}

export interface GetManyQueryOptions<T> extends QueryOptions {
  limit?:number,
  sort?:Array<Sort<T>>,
}



export class PostgresBaseCrudRepository<TABLE_ROW extends BaseTable> {

  private readonly _pool:Pool
  private readonly _tableName:string

  constructor(pool:Pool, tableName:string) {
    this._pool = pool;
    this._tableName = tableName
  }

  private async _runQuery<T>(query:string, params:Array<any>, options?:QueryOptions):Promise<T> {
    if (options?.client) {
      return options.client.query(query, params)
    }
    return this._pool.query(query, params)
  }

  async getOne(id:string, options?:QueryOptions):Promise<TABLE_ROW|null> {
    const query = `
      SELECT *
      FROM ${this._tableName}
      WHERE id = $1
      ORDER BY id
      LIMIT 1
    `
    try {
      const result:QueryResult<TABLE_ROW> = await this._runQuery(query, [id], options)
      if (result.rows.length === 0) {
        return null
      }
      return result.rows[0]
    } catch (err:any) {
      if (err.severity === 'ERROR' && err.code === '22P02') { // id was not of type uuid
        throw new NotFoundError(`Failed to find ${this._tableName} with id: ${id}`)
      }
      throw err
    }
  }

  async getMany(
    queries:Array<Query<TABLE_ROW>>,
    queryOptions:GetManyQueryOptions<TABLE_ROW>|null = null
  ):Promise<Array<TABLE_ROW>> {
    if (queries.length === 0) {
      logger.warn(`Query with no params on ${this._tableName}`)
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
      FROM ${this._tableName}
      WHERE ${whereClause}
      ${orderClause}
      ${limitClause}
    `
    const result:QueryResult<TABLE_ROW> = await this._runQuery(
      query,
      params,
      {client: queryOptions?.client},
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

  _buildInsertOneQuery(createRow:Create<TABLE_ROW>):{query:string, values:Array<any>} {
    const columnNames = new Array<string>()
    const columnValues = new Array<string>()
    const columnParams = new Array<string>()

    Object.keys(createRow).forEach(key => {
      const value = createRow[key]
      columnNames.push(key)
      columnValues.push(value ?? null)
      columnParams.push(`$${columnValues.length}`)
    })

    const query = `
      INSERT INTO ${this._tableName}
      (${columnNames.join(', ')})
      VALUES 
      (${columnParams.join(', ')})
    `
    return {query, values:columnValues}
  }

  async createOnly(createRow:Create<TABLE_ROW>, options?:QueryOptions):Promise<void> {
    const insertQuery = this._buildInsertOneQuery(createRow)
    await this._runQuery(insertQuery.query, insertQuery.values, options)
  }

  async createAndReturn(createRow:Create<TABLE_ROW>, options?:QueryOptions):Promise<TABLE_ROW> {
    const insertQuery = this._buildInsertOneQuery(createRow)

    const query = `
      ${insertQuery.query}
      RETURNING id
    `

    const result:QueryResult<string> = await this._runQuery(query, insertQuery.values, options)
    if (result.rows.length === 0) {
      throw new UnexpectedError(`Failed to create new ${this._tableName}`)
    }
    const createdRow = await this.getOne(result.rows[0], options)
    if (!createdRow) {
      throw new UnexpectedError(`Failed to find new ${this._tableName} with id: ${result.rows[0]}`)
    }
    return createdRow
  }



}
