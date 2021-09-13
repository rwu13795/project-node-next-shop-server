"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        // Javascript's built-in class Error breaks the prototype chain
        // in TS 2.2, we can restore prototype chain by writing the code below
        // see more detail on TS 2.2 - Support for new.target
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
/*
  // always send the data with consistent structure in the entire app
  // so that the React can handle this data in the same way
  
  // The common respone structure for error in the entire app
    {
      errors: {message: string, field?: string}[]    // an object array as the value of errors
    }
  
  */
//# sourceMappingURL=custom-error.js.map