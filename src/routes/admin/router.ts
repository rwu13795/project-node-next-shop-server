import express from "express";
import {
  body_addProduct,
  requestValidator,
  getImagesFromClient,
  multiFiles_bodyParser,
} from "../../middlewares";

import {
  addProduct,
  editProduct,
  deleteProduct,
  adminSignIn,
} from "./controllers";

const router = express.Router();

router.post(
  "/post-new-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  body_addProduct,
  requestValidator,
  addProduct
);

// router.post("/get-one-product", getOneProduct);

router.post(
  "/edit-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  body_addProduct,
  requestValidator,
  editProduct
);

router.post("/delete-product", deleteProduct);

router.post("/admin-auth", adminSignIn);

export { router as adminRouter };
