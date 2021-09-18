import express from "express";
import body_addProduct from "../../middlewares/request-validator/body-addProduct";
import requestValidator from "../../middlewares/request-validator/validator";
import getImagesFromClient from "../../middlewares/upload-multi-files/get-image-files";
import multiFiles_bodyParser from "../../middlewares/upload-multi-files/multi-files-bodyParser";

import { getOneProduct, addNewProcut, editProduct } from "./controllers";

const router = express.Router();

router.post(
  "/post-new-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  body_addProduct,
  requestValidator,
  addNewProcut
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
