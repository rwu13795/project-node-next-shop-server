import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import {
  OrderAddressFields,
  OrderContactInfo,
  PaymentDetail,
} from "../../../models/order/order-interfaces";
import { Order } from "../../../models/order/order-schema";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";
import { CurrentUser } from "../../auth/controllers";

interface ReqBody {
  currentUser: CurrentUser;
  shippingAddress: OrderAddressFields;
  billingAddress: OrderAddressFields;
  contactInfo: OrderContactInfo;
  totalAmount: number;
  paymentDetail: PaymentDetail;
}

export const createOrder = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      currentUser,
      shippingAddress,
      billingAddress,
      contactInfo,
      totalAmount,
      paymentDetail,
    }: ReqBody = req.body;

    console.log(currentUser.cart);
    console.log(req.session.currentUser.cart);

    // if (currentUser.cart !== req.session.currentUser.cart) {
    //   console.log("not match!!");
    //   return next(
    //     new Bad_Request_Error("The states of user's cart are not matched!")
    //   );
    // }

    let userId: string;
    if (!currentUser.userId) {
      userId = currentUser.username;
    } else {
      userId = currentUser.userId;
    }

    const newOrder = Order.build({
      userId,
      date: new Date(),
      items: currentUser.cart,
      total: totalAmount,
      shippingAddress,
      billingAddress,
      contactInfo,
      paymentDetail,
    });
    await newOrder.save();

    // save the order id in User
    if (req.session.isLoggedIn) {
      const user: UserDoc = await User.findById(currentUser.userId);
      if (!user.orders || user.orders.length < 1) {
        user.orders = [];
      }
      user.orders.push(newOrder._id);
      user.markModified("orders");
      await user.save();
    }

    ///////////////////////////////////////////////
    // need to send email to user about the order ID

    res.status(201).send({ message: "Order saved" });
  }
);
