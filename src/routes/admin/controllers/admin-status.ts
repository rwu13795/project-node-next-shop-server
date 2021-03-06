import { Request, Response, NextFunction } from "express";

import { tokens } from "../../../app";

export interface AdminUser {
  admin_username: string;
  admin_id: string;
  loggedInAsAdmin: boolean;
  isMasterAdmin: boolean;
}

export const getAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.adminUser || !req.session.csrf_secret_admin) {
    req.session.adminUser = {
      admin_username: "",
      admin_id: "",
      loggedInAsAdmin: false,
      isMasterAdmin: false,
    };

    req.session.csrf_secret_admin = tokens.secretSync();
  }

  const csrfToken = tokens.create(req.session.csrf_secret_admin);

  res.status(200).send({
    adminUser: req.session.adminUser,
    csrfToken,
  });
};
