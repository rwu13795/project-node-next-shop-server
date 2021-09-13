"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const request_validation_error_1 = require("../error-handler/request-validation-error");
const requestValidator = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // console.log("> > in requestValidator ", errors);
        throw new request_validation_error_1.RequestValidationError(errors.array());
        // return res.status(400).send({ message: errors.array()[0].msg });
        // errors.array() is a method of the validationResult, to convert the errors into an array
    }
    return next();
};
exports.default = requestValidator;
//# sourceMappingURL=validator.js.map