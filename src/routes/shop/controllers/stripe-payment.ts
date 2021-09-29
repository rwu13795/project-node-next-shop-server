import { Request, Response, NextFunction } from "express";
import { stripe } from "../../..";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";

export const stripePayment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalAmount: number = req.body.totalAmount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        order_id: "999",
      },
    });

    if (!paymentIntent) {
      return next(
        new Bad_Request_Error(
          "Something went wrong while creating payment-intent",
          "payment_intent"
        )
      );
    }

    res.status(201).send(paymentIntent);
  }
);
