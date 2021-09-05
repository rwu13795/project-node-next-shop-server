import { Request, Response } from "express";

import asyncWrapper from "../../../middlewares/async-wrapper";

export const getAllMenItems = asyncWrapper(
  async (req: Request, res: Response) => {
    res.status(200).send({ message: "OK" });
  }
);
