import {BaseError} from "./base-error";

export class InvalidArgumentError extends BaseError {
  constructor(message:string) {
    super(message);
  }
}