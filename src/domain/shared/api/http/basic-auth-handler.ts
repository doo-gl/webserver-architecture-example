import {RequestHandler} from "./request-handler";
import {httpConfig} from "../../client/config/http-config";
import {BasicAuthError} from "../../component/error/basic-auth-error";


export const BASIC_REQUEST_PARAM_AUTH_HANDLER:RequestHandler = (req, res, next) => {
  const config = httpConfig.get()
  const requestKey = req.query['basicAuth']
  if (config.basicAuthKey() !== requestKey) {
    throw new BasicAuthError('bad key');
  }
  next();
}
