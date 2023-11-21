import {MisconfigurationError} from "../../component/error/misconfiguration-error";

export enum EnvironmentVariable {
  ENVIRONMENT = 'ENVIRONMENT',
  PORT = 'PORT',
  BASIC_AUTH_KEY = 'BASIC_AUTH_KEY',
  BOOK_DATABASE_HOST = 'BOOK_DATABASE_HOST',
  BOOK_DATABASE_PORT = 'BOOK_DATABASE_PORT',
  BOOK_DATABASE_USERNAME = 'BOOK_DATABASE_USERNAME',
  BOOK_DATABASE_PASSWORD = 'BOOK_DATABASE_PASSWORD',
  BOOK_DATABASE_CONNECTIONS = 'BOOK_DATABASE_CONNECTIONS',
}

const retrieveOptional = (variable:EnvironmentVariable):string|null => {
  return process.env[variable] ?? null
}

const retrieve = (variable:EnvironmentVariable):string => {
  const value = retrieveOptional(variable)
  if (!value) {
    throw new MisconfigurationError(`Failed to find environment variable: ${variable}`)
  }
  return value
}

const retrieveInt = (variable:EnvironmentVariable):number => {
  const value = retrieve(variable)
  const intValue = Number.parseInt(value)
  if (Number.isNaN(intValue)) {
    throw new MisconfigurationError(`Failed to find environment variable: ${variable}, expected an Integer`)
  }
  return intValue
}

export const environmentVariableRetriever = {
  retrieveOptional,
  retrieve,
  retrieveInt,
}
