import QueryString from 'qs'
import {ValidationError} from "../../component/error/validation-error";

type QueryParam = string|string[]|QueryString.ParsedQs|QueryString.ParsedQs[]|undefined

export const optionalString = (queryParams:QueryString.ParsedQs, key:string):string|undefined => {
  const queryParam:QueryParam = queryParams[key]
  if (queryParam === undefined) {
    return undefined
  }
  if (typeof queryParam !== "string") {
    throw new ValidationError(`Expected query param ${key} to be a string`)
  }
  return queryParam
}

export const optionalInteger = (queryParams:QueryString.ParsedQs, key:string):number|undefined => {
  const queryParamString:string|undefined = optionalString(queryParams, key)
  if (queryParamString === undefined) {
    return undefined
  }
  const queryParamInt = Number.parseInt(queryParamString)
  if (Number.isNaN(queryParamInt)) {
    throw new ValidationError(`Expected query param ${key} to be an Integer`)
  }
  return queryParamInt
}