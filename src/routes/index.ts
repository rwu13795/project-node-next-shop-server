import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../middlewares";

export const homeIndex = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .send("<h1>NodeJS server for project node-next-shop-client</h1>");
  }
);
