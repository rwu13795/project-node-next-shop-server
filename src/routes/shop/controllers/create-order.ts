import { Request, Response, NextFunction } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  OrderAddressFields,
  OrderContactInfo,
} from "../../../models/order/order-interfaces";
import { Order } from "../../../models/order/order-schema";
import { CurrentUser } from "../../auth/controllers";

interface ReqBody {
  currentUser: CurrentUser;
  shippingAddress: OrderAddressFields;
  billingAddress: OrderAddressFields;
  contactInfo: OrderContactInfo;
}

export const createOrder = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      currentUser,
      shippingAddress,
      billingAddress,
      contactInfo,
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
      shippingAddress,
      billingAddress,
      contactInfo,
    });
    await newOrder.save();

    ///////////////////////////////////////////////
    // need to send email to user about the order ID

    res.status(201).send({ message: "Order saved" });
  }
);
