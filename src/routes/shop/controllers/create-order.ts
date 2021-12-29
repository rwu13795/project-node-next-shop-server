import { Request, Response, NextFunction } from "express";
import { transporter } from "../../auth/router";
import { config } from "dotenv";

import { asyncWrapper } from "../../../middlewares";
import {
  OrderAddressFields,
  OrderContactInfo,
  PaymentDetail,
} from "../../../models/order/order-interfaces";
import { Order } from "../../../models/order/order-schema";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";
import { capitalizeAddress } from "../../../utils/capitalize-letter";
import { CurrentUser } from "../../auth/controllers";

interface ReqBody {
  currentUser: CurrentUser;
  shippingAddress: OrderAddressFields;
  billingAddress: OrderAddressFields;
  contactInfo: OrderContactInfo;
  totalAmount: number;
  paymentDetail: PaymentDetail;
}

if (process.env.NODE_ENV !== "production") {
  config();
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

    const capShippingAddress = capitalizeAddress(shippingAddress);
    const capBillingAddress = capitalizeAddress(billingAddress);

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
      shippingAddress: capShippingAddress,
      billingAddress: capBillingAddress,
      contactInfo,
      paymentDetail,
    });
    await newOrder.save();

    // save the order id in User
    if (req.session.currentUser.isLoggedIn) {
      const user: UserDoc = await User.findById(currentUser.userId);
      if (!user.orders || user.orders.length < 1) {
        user.orders = [];
      }
      user.orders.push(newOrder._id);
      user.markModified("orders");
      await user.save();
    }

    // send order ID to user email
    transporter.sendMail({
      from: "rwu13795.work@gmail.com",
      to: contactInfo.email,
      subject: "Thank you for your purchase!",
      html: `<h2>Thank you for your purchase!</h2>
      <p><strong>Order ID: ${newOrder._id}</strong></P>
        <p>You could use this ID on the 
        <a href="${process.env.CLIENT_HOST_URL}/shop/order-status"><strong>Order Status</strong></a>
         page to track your order</P>
        `,
    });

    res.status(201).send({
      currentOrder: {
        _id: newOrder._id,
        date: newOrder.date,
        items: newOrder.items,
        total: newOrder.total,
        shippingAddress: newOrder.shippingAddress,
        paymentDetail,
      },
    });
  }
);
