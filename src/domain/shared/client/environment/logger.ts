
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const write = (level:LogLevel, message?:string, object?:any):void => {
  const convertedObject = object
    ? JSON.stringify(object)
    : undefined

  switch (level) {
    case LogLevel.DEBUG:
      convertedObject
        ? console.debug(message, convertedObject)
        : console.debug(message)
      break;
    case LogLevel.INFO:
      convertedObject
        ? console.info(message, convertedObject)
        : console.info(message)
      break;
    case LogLevel.WARN:
      convertedObject
        ? console.warn(message, convertedObject)
        : console.warn(message)
      break;
    case LogLevel.ERROR:
      convertedObject
        ? console.error(message, convertedObject)
        : console.error(message)
      break;
  }
}

const debug = (message?:string, object?:any):void => {
  write(LogLevel.DEBUG, message, object)
}
const info = (message?:string, object?:any):void => {
  write(LogLevel.INFO, message, object)
}
const warn = (message?:string, object?:any):void => {
  write(LogLevel.WARN, message, object)
}
const error = (message?:string, object?:any):void => {
  write(LogLevel.ERROR, message, object)
}

export const logger = {
  debug,
  info,
  warn,
  error,
}