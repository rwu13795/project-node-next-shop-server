import { Request, Response, NextFunction } from "express";

import { tokens } from "../../../app";

export interface AdminUser {
  admin_username: string;
  admin_id: string;
  loggedInAsAdmin: boolean;
}

export const getAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.adminUser) {
    req.session.adminUser = {
      admin_username: "",
      admin_id: "",
      loggedInAsAdmin: false,
    };
  }

  req.session.csrf_secret_admin = tokens.secretSync();

  const csrfToken = tokens.create(req.session.csrf_secret_admin);
  console.log("token in get admin auth", csrfToken);

  console.log("checking session in get Admin Auth---->", req.session);

  res.status(200).send({
    adminUser: req.session.adminUser,
    csrfToken,
  });
};
