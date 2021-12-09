import { Request, Response, NextFunction } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { Order } from "../../../models/order/order-schema";

export const orderStatus = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.body.orderId as string;

    if (orderId.length !== 24) {
      return next(
        new Bad_Request_Error(
          "Sorry, we could not find any order associated with this ID"
        )
      );
    }

    const order = await Order.findById(orderId)
      .select(["items", "total", "date", "shippingAddress", "paymentDetail"])
      .lean();

    if (!order) {
      return next(
        new Bad_Request_Error(
          "Sorry, we could not find any order associated with this ID"
        )
      );
    }

    res.status(200).send({ order });
  }
);
