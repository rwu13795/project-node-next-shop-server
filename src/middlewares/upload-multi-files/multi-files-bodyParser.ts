import { Request, Response, NextFunction } from "express";

export const multiFiles_bodyParser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // becuase we are using "FormData" to send both the image-files and JSON data,
  // we have to parse the "req.body.document" and put this "document" back inside
  // "req.body", so that the "bodyValidator" can access the correct "body"

  const document = JSON.parse(req.body.document);

  req.body = document;

  next();
};
