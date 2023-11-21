import {DatabaseConfig} from "../../../shared/client/config/database-config";
import {
  EnvironmentVariable,
  environmentVariableRetriever
} from "../../../shared/client/environment/environment-variable-retriever";


export interface BookDatabaseConfig extends DatabaseConfig {
  databaseName:() => 'book'
}

const get = ():BookDatabaseConfig => {
  return {
    databaseName: () => 'book',
    host: () => environmentVariableRetriever.retrieve(EnvironmentVariable.BOOK_DATABASE_HOST),
    port: () => environmentVariableRetriever.retrieveInt(EnvironmentVariable.BOOK_DATABASE_PORT),
    user: () => environmentVariableRetriever.retrieve(EnvironmentVariable.BOOK_DATABASE_USERNAME),
    password: () => environmentVariableRetriever.retrieve(EnvironmentVariable.BOOK_DATABASE_PASSWORD),
    maxConnections: () => environmentVariableRetriever.retrieveInt(EnvironmentVariable.BOOK_DATABASE_CONNECTIONS),
  }
}

export const bookDatabaseConfig = {
  get
}