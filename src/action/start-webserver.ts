import {uuid} from "../domain/shared/client/external-lib/uuid";
import {BOOK_ENDPOINTS} from "../domain/book/api/book-endpoints";
import {endpointBuilder} from "../domain/shared/api/http/endpoint-builder";
import {requestTimingMiddlewareBuilder} from "../domain/shared/api/http/request-timing-middleware-builder";
import {
  EnvironmentVariable,
  environmentVariableRetriever
} from "../domain/shared/client/environment/environment-variable-retriever";
import {Server} from "http";
import {logger} from "../domain/shared/client/environment/logger";

const serverStart = new Date()
const instanceId = uuid()

const endpoints = BOOK_ENDPOINTS

const app = endpointBuilder.buildApp(
  endpoints,
  {
    preMiddleware: [
      requestTimingMiddlewareBuilder.build(instanceId)
    ]
  }
)
const port = environmentVariableRetriever.retrieveInt(EnvironmentVariable.PORT)


const server:Server = app.listen(port, () => {
  logger.info(`listening on port ${port}, server startup took: ${new Date().getTime() - serverStart.getTime()}ms`);
});