import express from "express";
import {
  body_addProduct,
  requestValidator,
  getImagesFromClient,
  multiFiles_bodyParser,
} from "../../middlewares";

import { addProduct } from "./controllers/add-product";
import { editProduct } from "./controllers/edit-product";
import { getOneProduct } from "./controllers/get-one-product";

const router = express.Router();

router.post(
  "/post-new-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  body_addProduct,
  requestValidator,
  addProduct
);

router.post("/get-one-product", getOneProduct);

router.post(
  "/edit-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  body_addProduct,
  requestValidator,
  editProduct
);

export { router as adminRouter };
