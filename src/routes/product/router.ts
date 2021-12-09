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
} from "./controllers";

const router = express.Router();

// router.get("/", getMainCat);

// this route must be in front of the "/:main_cat/:sub_cat", since /:main_cat will
// try to match any thing
router.get("/search-product", searchProduct);

router.get("/detail/:productId", createSession, getDetail);

router.get("/:main_cat", getMainCat);

router.get("/:main_cat/:sub_cat", getSubCat);

router.put("/update-stock", createSession, updateStock);

router.post("/add-review", addReview);

router.post("/get-reviews", getReviews);

router.post("/delete-review", deleteReview);

export { router as productRouter };
