import { CustomError } from "./custom-error";

export class Not_Found_Error extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");

    Object.setPrototypeOf(this, Not_Found_Error.prototype);
  }

  serializeErrors() {
    return [{ message: "Page Not Found" }];
  }
}
