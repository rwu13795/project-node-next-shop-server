import { Request, Response, NextFunction } from "express";

const asyncWrapper = (callback: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // invoke the function that was passed to the wrapper
      await callback(req, res, next);
    } catch (error) {
      // there is a custom error handler component
      next(error);
    }
  };
};

export default asyncWrapper;
