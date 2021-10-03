import express from "express";
import { createSession } from "../../middlewares";

import {
  getMainCat,
  getSubCat,
  getDetail,
  updateQuantity,
} from "./controllers";

const router = express.Router();

// router.get("/", getMainCat);

router.get("/:main_cat", getMainCat);

router.get("/:main_cat/:sub_cat", getSubCat);

router.get("/detail/:category/:productId", getDetail);

router.put("/update-quantity", createSession, updateQuantity);

export { router as productRouter };
