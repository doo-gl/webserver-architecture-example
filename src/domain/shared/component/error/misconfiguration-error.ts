import {BaseError} from "./base-error";

export class MisconfigurationError extends BaseError {
  constructor(message:string) {
    super(message);
  }
}