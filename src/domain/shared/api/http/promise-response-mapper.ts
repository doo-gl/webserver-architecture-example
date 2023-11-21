import express from "express";
import {PromiseRequestHandler, RequestHandler} from "./request-handler";

export enum ResponseFormat {
  JSON = 'JSON',
  STRING = 'STRING',
}

const map = (
  responsePromiseSupplier:PromiseRequestHandler,
  responseFormat: string = ResponseFormat.JSON
): RequestHandler => {

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const responsePromise = responsePromiseSupplier(req, res, next);
    responsePromise
      .then((responseResult: object|string|void|undefined|null) => {
        if (responseResult === undefined || responseResult === null) {
          // Send empty response
          res.send();
        } else if (responseFormat === ResponseFormat.JSON) {
          res.json(responseResult);
        } else { // responseFormat === ResponseFormat.STRING
          res.send(responseResult);
        }
      })
      .catch((err: any) => {
        if (err instanceof Error) {
          next(err);
          return;
        }
        next(new Error(JSON.stringify(err)));
      });
  }
};

export const promiseResponseMapper = {
  map,
};
