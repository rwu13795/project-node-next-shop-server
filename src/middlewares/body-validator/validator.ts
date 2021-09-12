import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const bodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).send({ message: errors.array()[0].msg });
    // errors.array() is a method of the validationResult, to convert the errors into an array
  }

  return next();
};

export default bodyValidator;
