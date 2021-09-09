"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// import { CustomError } from "../errors/custom-error";
// if there are 4 arguments in a function, express will treat this
// function as an error handling function automatically
// whenever an error is thrown inside the routes, this errorHandler will be
// tiggered to handle the error
const errorHandler = (err, req, res, next // to handle async error handling
) => {
    // an ValidationError array is passed in Request_Validation_Error in signup.ts
    // the instanceof applies to all the CustomError's subclass, so we don't need
    // to check each custom error handler manually
    //   if (err instanceof CustomError) {
    //     return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    //   }
    // the error which no handler can handle
    console.log(">>>>>>>>>>>>>>>>>>", err); // log the error details
    res.status(400).send({
        message: "The error that no handler can handle !",
        field: "main",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map