import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../error-handler/request-validation-error";

const requestValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log("> > in requestValidator ", errors);
    throw new RequestValidationError(errors.array());
    // return res.status(400).send({ message: errors.array()[0].msg });
    // errors.array() is a method of the validationResult, to convert the errors into an array
  }

  return next();
};

export default requestValidator;
