import {EnvironmentVariable, environmentVariableRetriever} from "./environment-variable-retriever";

export enum Environment {
  LOCAL =  'LOCAL',
  DEV = 'DEV',
  PREPROD = 'PREPROD',
  PROD = 'PROD'
}

const getEnvironment = ():Environment => {
  const env = environmentVariableRetriever.retrieveOptional(EnvironmentVariable.ENVIRONMENT)
  switch (env) {
    case Environment.LOCAL:
      return Environment.LOCAL;
    case Environment.DEV:
      return Environment.DEV;
    case Environment.PREPROD:
      return Environment.PREPROD;
    case Environment.PROD:
      return Environment.PROD;
    default:
      return Environment.LOCAL;
  }
}

const isLocal = ():boolean => {
  return getEnvironment() === Environment.LOCAL
}
const isDev = ():boolean => {
  return getEnvironment() === Environment.DEV
}
const isPreprod = ():boolean => {
  return getEnvironment() === Environment.PREPROD
}
const isProd = ():boolean => {
  return getEnvironment() === Environment.PROD
}

export const environment = {
  isLocal,
  isDev,
  isPreprod,
  isProd
}