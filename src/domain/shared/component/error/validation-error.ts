import {BaseError} from "./base-error";

export class ValidationError extends BaseError {

  readonly details?:any;

  constructor(message:string, details?:any) {
    super(message);
    this.details = details;
  }
}