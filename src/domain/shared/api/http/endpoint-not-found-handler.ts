import {RequestHandler} from "./request-handler";
import {NotFoundError} from "../../component/error/not-found-error";


export const endpointNotFoundHandler:RequestHandler = (req, res, next) => {
  const err = new NotFoundError(`Path ${req.method} ${req.path} does not match a valid endpoint`);
  next(err);
}