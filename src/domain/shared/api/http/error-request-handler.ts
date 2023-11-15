

import {ErrorRequestHandler} from "./request-handler";
import {logger} from "../../client/logger";
import {environment} from "../../client/environment";

export const errorRequestHandler:ErrorRequestHandler = (err, req, res, next) => {
  // set locals, do not add error in prod
  res.locals.message = err.message;
  res.locals.error = environment.isProd() ? {} : err;

  logger.error('Request failed', err);

  res.status(err.status || 500);
  res.json({
    name: err.name,
    message: err.message,
  });
}