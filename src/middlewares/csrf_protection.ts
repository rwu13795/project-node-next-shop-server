import { Request, Response, NextFunction } from "express";
import { Bad_Request_Error } from ".";
import { tokens } from "../app";

export const csrf_protection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.csrfToken;

  if (!tokens.verify(req.session.csrf_secret, token)) {
    return next(
      new Bad_Request_Error("Invalid token! YOU DON'T BELONG HERE!!!")
    );
  }
  return next();
};
