import {BaseError} from "./base-error";

export class BasicAuthError extends BaseError {
  constructor(message:string) {
    super(message);
  }
}