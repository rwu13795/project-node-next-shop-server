import { NextFunction, Request, Response } from "express";

import { asyncWrapper } from "../../../middlewares";

export const signOut = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.adminUser && req.session.adminUser?.loggedInAsAdmin) {
      req.session.currentUser = null;
      req.session.csrf_secret_user = null;
    } else {
      req.session.destroy(() => {});
    }

    res.status(201).send({ message: "Signed out" });
  }
);
