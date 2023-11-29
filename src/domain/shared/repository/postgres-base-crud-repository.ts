
import {Client, Pool, PoolClient, QueryResult} from "pg";
import {BaseTable, BatchUpdate, Create, Update} from "./base-database-schema";
import {logger} from "../client/environment/logger";
import {NotFoundError} from "../component/error/not-found-error";
import {UnexpectedError} from "../component/error/unexpected-error";
import {InvalidArgumentError} from "../component/error/invalid-argument-error";

type QueryOperation = '=='|'!='|'in-array'

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
  client?:Client,
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

  getTableName():string {
    return this._tableName
  }

  getPool():Pool {
    return this._pool;
  }

  private async _runQuery<T>(query:string, params:Array<any>, options?:QueryOptions):Promise<QueryResult<T>> {
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

  _mapQueryToWhereClause(query:Query<TABLE_ROW>, params:Array<any>):{whereClause:string, params:Array<any>} {
    const newParams = params.slice()
    switch (query.operation) {
      case "==":
        newParams.push(query.value)
        return {whereClause: `(${query.field} = $${params.length})`, params: newParams}
      case "!=":
        newParams.push(query.value)
        return {whereClause: `(${query.field} != $${params.length})`, params: newParams}
      case "in-array":
        if (!Array.isArray(query.value)) {
          throw new InvalidArgumentError(`Passed an object that is not array to "in-array" query operator, actual type: ${typeof query.value}`)
        }
        const paramNames = new Array<string>()
        query.value.forEach(val => {
          newParams.push(val)
          paramNames.push(`$${newParams.length}`)
        })
        return {whereClause: `(${query.field} IN (${paramNames.join(', ')}))`, params: newParams}
      default:
        throw new InvalidArgumentError(`Unrecognised operation: ${query.operation}`)
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
    let params = new Array<any>()
    queries.forEach((query:Query<TABLE_ROW>) => {
      const newWhereClause = this._mapQueryToWhereClause(query, params)
      whereClause = `${whereClause} AND ${newWhereClause.whereClause}`
      params = newWhereClause.params
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

  async getByIds(ids:Array<string>, options?:QueryOptions):Promise<Array<TABLE_ROW>> {

    const paramKeys = ids.map((value, index) => `${index + 1}`)

    const query = `
      SELECT *
      FROM ${this._tableName}
      WHERE id IN (${paramKeys.join(', ')})
      ORDER BY id
      LIMIT 1
    `
    const result:QueryResult<TABLE_ROW> = await this._runQuery(query, ids, options)
    return result.rows
  }

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

  _buildInsertManyQuery(createRows:Array<Create<TABLE_ROW>>):{query:string, values:Array<any>} {
    const columnNames = new Array<string>()
    const firstCreate = createRows[0]
    Object.keys(firstCreate).forEach(key => {
      columnNames.push(key)
    })

    const columnValues = new Array<string>()
    const insertStatements = new Array<string>()
    createRows.forEach(row => {
      const columnParams = new Array<string>()
      Object.keys(row).forEach(key => {
        const value = row[key]
        columnValues.push(value ?? null)
        columnParams.push(`$${columnValues.length}`)
      })
      insertStatements.push(`(${columnParams.join(', ')})`)
    })

    const query = `
      INSERT INTO ${this._tableName}
      (${columnNames.join(', ')})
      VALUES 
      ${insertStatements.join(' ')}
    `
    return {query, values:columnValues}
  }

  async batchCreate(creates:Array<Create<TABLE_ROW>>, options?:QueryOptions):Promise<Array<string>> {
    if (creates.length === 0) {
      return []
    }
    const insertQuery = this._buildInsertManyQuery(creates)

    const query = `
      ${insertQuery.query}
      RETURNING id
    `

    const result:QueryResult<string> = await this._runQuery(query, insertQuery.values, options)
    if (result.rows.length === 0) {
      throw new UnexpectedError(`Failed to create ${creates.length} new ${this._tableName}, in batch`)
    }
    const createdIds = result.rows
    return createdIds
  }

  _buildUpdateOneQuery(id:string, updateRow:Update<TABLE_ROW>):{query:string, values:Array<any>} {
    const columnNames = new Array<string>()
    const columnParams = new Array<string>()
    const columnValues = new Array<string>()

    columnValues.push(id)

    Object.keys(updateRow).forEach(key => {
      const value = updateRow[key]
      columnNames.push(key)
      columnValues.push(value ?? null)
      columnParams.push(`$${columnValues.length}`)
    })

    const query = `
      UPDATE ${this._tableName}
      SET (${columnNames.join(', ')}) = (${columnParams.join(', ')})
      WHERE id = $1
    `
    return {query, values:columnValues}
  }

  async updateAndReturn(id:string, updateRow:Update<TABLE_ROW>, options?:QueryOptions):Promise<TABLE_ROW> {

    const builtQuery = this._buildUpdateOneQuery(id, updateRow)
    const query = `
      ${builtQuery.query}
      RETURNING *
    `

    const result:QueryResult<TABLE_ROW> = await this._runQuery(query, builtQuery.values, options)
    if (result.rows.length === 0) {
      throw new UnexpectedError(`Failed to update ${this._tableName} with id: ${id}`)
    }
    return result.rows[0]
  }

  async updateOnly(id:string, updateRow:Update<TABLE_ROW>, options?:QueryOptions):Promise<void> {
    const builtQuery = this._buildUpdateOneQuery(id, updateRow)
    await this._runQuery(builtQuery.query, builtQuery.values, options)
  }

  async batchUpdate(updates:Array<BatchUpdate<TABLE_ROW>>, options?:QueryOptions):Promise<{ids:Array<string>}> {
    // todo, update all rows in batch, return the ids of the updated rows
  }

}
