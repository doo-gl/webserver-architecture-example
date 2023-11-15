import {EndpointAuth} from "./promise-router";
import {NO_OP_HANDLER} from "./request-handler";
import {BASIC_REQUEST_PARAM_AUTH_HANDLER} from "./basic-auth-handler";

export const NO_AUTHORIZATION:EndpointAuth = {
  authFns: [NO_OP_HANDLER],
};

export const BASIC_AUTH:EndpointAuth = {
  authFns: [BASIC_REQUEST_PARAM_AUTH_HANDLER],
}