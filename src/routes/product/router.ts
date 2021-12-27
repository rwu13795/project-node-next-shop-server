import express from "express";
import { createSession } from "../../middlewares";

import {
  getMainCat,
  getSubCat,
  getDetail,
  updateStock,
  searchProduct,
  addReview,
  getReviews,
  deleteReview,
  getAccessories,
} from "./controllers";

const router = express.Router();

router.get("/search-product", searchProduct);

router.get("/detail/:productId", createSession, getDetail);

router.get("/get-accessories", getAccessories);

router.get("/get/:main_cat", getMainCat);

router.get("/get/:main_cat/:sub_cat", getSubCat);

router.put("/update-stock", createSession, updateStock);

router.post("/add-review", addReview);

router.post("/get-reviews", getReviews);

router.post("/delete-review", deleteReview);

export { router as productRouter };
