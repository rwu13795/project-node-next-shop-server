import express from "express";
import {
  csrf_protection_user,
  requireUserAuth,
  updateCartInDatebase,
} from "../../middlewares";

import {
  addToCart,
  changeQuantity,
  removeFromCart,
  stripePayment,
  createOrder,
  clearCart,
  checkStock,
  orderHistory,
  orderStatus,
} from "./controllers";

const router = express.Router();

router.post("/add-to-cart", addToCart, updateCartInDatebase);

router.post("/remove-from-cart", removeFromCart, updateCartInDatebase);

router.post("/change-quantity", changeQuantity, updateCartInDatebase);

router.post("/create-order-history", createOrder);

router.get("/get-order-history", requireUserAuth, orderHistory);

router.post("/clear-cart", clearCart, updateCartInDatebase);

router.get("/check-stock", checkStock);

router.post("/stripe-payment", csrf_protection_user, stripePayment);

router.post("/order-status", orderStatus);

export { router as shopRouter };
