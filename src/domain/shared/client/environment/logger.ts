
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const write = (level:LogLevel, message?:string, object?:any):void => {
  const convertedObject = JSON.stringify(object)
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(message, convertedObject)
      break;
    case LogLevel.INFO:
      console.info(message, convertedObject)
      break;
    case LogLevel.WARN:
      console.warn(message, convertedObject)
      break;
    case LogLevel.ERROR:
      console.error(message, convertedObject)
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