import {RequestHandler} from "./request-handler";
import {logger} from "../../client/environment/logger";

const build = (instanceId:string):RequestHandler => {
  return (req, resp, next) => {
    const reqStart = new Date()
    logger.info(`${reqStart.toISOString()} - ${instanceId} - ${req.method} ${req.originalUrl}`)
    resp.on('finish', () => {
      logger.info(`${new Date().toISOString()} - ${instanceId} - ${req.method} ${req.originalUrl} - ${resp.statusCode} - ${new Date().getTime() - reqStart.getTime()}ms`)
    })
    next()
  }
}

export const requestTimingMiddlewareBuilder = {
  build
}