import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";

export const adminSignOut = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.currentUser && req.session.currentUser?.isLoggedIn) {
      req.session.adminUser = null;
      req.session.csrf_secret_admin = null;
    } else {
      req.session.destroy(() => {});
    }

    res.status(201).send({ message: "Admin signed out" });
  }
);
