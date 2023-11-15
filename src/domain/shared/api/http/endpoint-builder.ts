
import {Endpoint, Method} from "./endpoint";
import express, {Express} from "express";
import {EndpointAuth} from "./promise-router";
import {PromiseRequestHandler, RequestHandler} from "./request-handler";
import {promiseResponseMapper, ResponseFormat} from "./promise-response-mapper";
import bodyParser from "body-parser";

import {endpointNotFoundHandler} from "./endpoint-not-found-handler";
import {errorToHttpResponseHandler} from "./error-to-http-response-handler";
import {errorRequestHandler} from "./error-request-handler";

import {errorMappings} from "./error-mappings";
import {logger} from "../../client/environment/logger";
import {UnexpectedError} from "../../component/error/unexpected-error";


const listAuthorizationHandlers = (auth:EndpointAuth):Array<RequestHandler> => {
  const handlers:Array<RequestHandler> = [];
  return handlers.concat(auth.authFns);
}

const createRouter = (endpoint:Endpoint):express.Router => {
  logger.info(`Endpoint Starting: ${endpoint.method} - ${endpoint.path}`)
  const router = express.Router();
  if (endpoint.preMiddleware && endpoint.preMiddleware.length > 0) {
    router.use(endpoint.preMiddleware);
  }

  const authHandlers = listAuthorizationHandlers(endpoint.auth);
  const responseFormat = endpoint.responseFormat || ResponseFormat.JSON;
  const requestHandler:PromiseRequestHandler = (req, res, next) => endpoint.requestHandler(req, res, next);

  if (endpoint.method === Method.GET) {
    router.get(
      endpoint.path,
      ...authHandlers,
      promiseResponseMapper.map(requestHandler, responseFormat)
    );
    return router;
  } else if (endpoint.method === Method.POST) {
    router.post(
      endpoint.path,
      ...authHandlers,
      promiseResponseMapper.map(requestHandler, responseFormat)
    );
    return router;
  } else if (endpoint.method === Method.PUT) {
    router.put(
      endpoint.path,
      ...authHandlers,
      promiseResponseMapper.map(requestHandler, responseFormat)
    );
    return router;
  } else if (endpoint.method === Method.DELETE) {
    router.delete(
      endpoint.path,
      ...authHandlers,
      promiseResponseMapper.map(requestHandler, responseFormat)
    );
    return router;
  }
  throw new UnexpectedError(`Do not recognise method: ${endpoint.method}`);
}

const buildApp = (endpoints:Array<Endpoint>, options?:{preMiddleware?:Array<RequestHandler>}) => {
  const app:Express = express();
  app.disable('x-powered-by');

  if (options?.preMiddleware) {
    options?.preMiddleware?.forEach(preMiddlewareHandler => {
      app.use(preMiddlewareHandler)
    })
  }
  app.use(bodyParser.json() as RequestHandler);
  app.use(bodyParser.urlencoded({ extended: false }) as RequestHandler);

  endpoints.forEach(endpoint => {
    const router = createRouter(endpoint);
    app.use(router);
  })

  app.use(endpointNotFoundHandler);
  errorMappings.init();
  app.use(errorToHttpResponseHandler.handle);
  app.use(errorRequestHandler);
  return app;
}

export const endpointBuilder = {
  buildApp,
}