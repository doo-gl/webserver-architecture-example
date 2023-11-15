import {PromiseRequestHandler, RequestHandler} from "./request-handler";
import {ResponseFormat} from "./promise-response-mapper";
import {EndpointAuth} from "./promise-router";

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface Endpoint {
  method:Method,
  path:string,
  auth:EndpointAuth,
  requestHandler:PromiseRequestHandler,
  responseFormat?:ResponseFormat,
  preMiddleware?:Array<RequestHandler>
}