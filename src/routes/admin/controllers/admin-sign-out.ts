import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";

export const adminSignOut = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.adminUser = null;
    req.session.csrf_secret_admin = null;

    res.status(201).send({ message: "Admin signed out" });
  }
);
