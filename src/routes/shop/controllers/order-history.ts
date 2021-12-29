import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import { Order } from "../../../models/order/order-schema";

export const orderHistory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.currentUser.userId;
    const ORDER_PER_PAGE = 5;

    let pageNum = parseInt(req.query.pageNum as string) || 1;

    let ordersTotal = 0;
    if (pageNum === 1) {
      ordersTotal = await Order.countDocuments({ userId });
    }

    const ordersHistory = await Order.find({ userId })
      .select(["items", "total", "date", "shippingAddress", "paymentDetail"])
      .sort({ date: -1 })
      .skip((pageNum - 1) * ORDER_PER_PAGE)
      .limit(ORDER_PER_PAGE)
      .lean();

    res.status(200).send({ orders: ordersHistory, ordersTotal });
  }
);
