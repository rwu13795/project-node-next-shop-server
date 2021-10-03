import express from "express";
import { csrf_protection } from "../../middlewares";

import {
  addToCart,
  changeQuantity,
  removeFromCart,
  stripePayment,
  createOrder,
  clearCart,
  checkStock,
} from "./controllers";

const router = express.Router();

router.post("/add-to-cart", addToCart);

router.post("/remove-from-cart", removeFromCart);

router.post("/change-quantity", changeQuantity);

router.post("/create-order-history", createOrder);

router.post("/clear-cart", clearCart);

router.get("/check-stock", checkStock);

router.post("/stripe-payment", csrf_protection, stripePayment);

export { router as shopRouter };