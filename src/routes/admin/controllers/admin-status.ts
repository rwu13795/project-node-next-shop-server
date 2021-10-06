import { Request, Response, NextFunction } from "express";

export interface AdminUser {
  admin_id: string;
  loggedInAsAdmin: boolean;
  _id: string;
}

export const getAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("checking session in getAuth---->", req.session.adminUser);

  res.status(200).send({
    adminUser: req.session.adminUser,
  });
};
