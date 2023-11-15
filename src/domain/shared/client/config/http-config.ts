import {EnvironmentVariable, environmentVariableRetriever} from "../environment/environment-variable-retriever";

export interface HttpConfig {
  basicAuthKey:() => string,
}

const get = ():HttpConfig => {
  return {
    basicAuthKey: () => environmentVariableRetriever.retrieve(EnvironmentVariable.BASIC_AUTH_KEY),
  }
}

export const httpConfig = {
  get,
}