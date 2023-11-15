import {errorToHttpResponseHandler, mapTypeToStatus} from "./error-to-http-response-handler";
import {BasicAuthError} from "../../component/error/basic-auth-error";
import {NotFoundError} from "../../component/error/not-found-error";
import {InvalidArgumentError} from "../../component/error/invalid-argument-error";
import {ValidationError} from "../../component/error/validation-error";
import {UnexpectedError} from "../../component/error/unexpected-error";
import {UnauthorizedError} from "../../component/error/unauthorized-error";


const init = () => {
  errorToHttpResponseHandler.registerErrorMapper(mapTypeToStatus(BasicAuthError, 401));
  errorToHttpResponseHandler.registerErrorMapper(mapTypeToStatus(NotFoundError, 404));
  errorToHttpResponseHandler.registerErrorMapper(mapTypeToStatus(InvalidArgumentError, 400));
  errorToHttpResponseHandler.registerErrorMapper(mapTypeToStatus(UnauthorizedError, 401));
  errorToHttpResponseHandler.registerErrorMapper(mapTypeToStatus(ValidationError, 400));
  errorToHttpResponseHandler.registerErrorMapper(mapTypeToStatus(UnexpectedError, 500));
}

export const errorMappings = {
  init,
}