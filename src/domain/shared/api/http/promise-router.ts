import {PromiseRequestHandler, RequestHandler} from "./request-handler";
import {ResponseFormat} from "./promise-response-mapper";

export interface EndpointAuth {
  authFns: Array<RequestHandler>,
}

export interface Route {
  path:string,
  auth:EndpointAuth,
  routeFn:PromiseRequestHandler,
  responseFormat:ResponseFormat
}

