import { Request, Response, NextFunction } from "express";
import { Not_Authorized_Error } from ".";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.isLoggedIn) {
    throw new Not_Authorized_Error();
  }
  next();
};
