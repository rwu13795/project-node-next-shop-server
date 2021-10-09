import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import { Order } from "../../../models/order/order-schema";
import { User } from "../../../models/user/user-schema";

export const orderHistory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.currentUser.userId;
    const ORDER_PER_PAGE = 5;
    let pageNum = 1;
    if (typeof req.body.pageNum === "number") {
      pageNum = parseInt(req.body.pageNum);
    }

    console.log("pageNUm", pageNum);

    let ordersTotal = 0;
    if (pageNum === 1) {
      ordersTotal = await Order.countDocuments({ userId });
    }

    const ordersHistory = await Order.find({ userId })
      .skip((pageNum - 1) * ORDER_PER_PAGE)
      .limit(ORDER_PER_PAGE)
      .select(["items", "total", "date"])
      .lean();

    // console.log(ordersHistory);

    res.status(200).send({ orders: ordersHistory, ordersTotal });
  }
);
