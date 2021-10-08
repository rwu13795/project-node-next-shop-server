import { Request, Response, NextFunction } from "express";
import { Not_Authorized_Error } from "..";

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.adminUser.loggedInAsAdmin) {
    throw new Not_Authorized_Error();
  }
  next();
};
