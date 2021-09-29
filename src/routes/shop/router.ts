import express from "express";

import {
  addToCart,
  changeQuantity,
  removeFromCart,
  stripePayment,
  createOrder,
} from "./controllers";

const router = express.Router();

router.post("/add-to-cart", addToCart);

router.post("/remove-from-cart", removeFromCart);

router.post("/change-quantity", changeQuantity);

router.post("/create-order-history", createOrder);

router.post("/stripe-payment", stripePayment);

export { router as shopRouter };
