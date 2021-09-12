import express from "express";
import body_addProduct from "../../middlewares/body-validator/body_addProduct";
import bodyValidator from "../../middlewares/body-validator/validator";
import getImagesFromClient from "../../middlewares/upload-multi-files/get-image-files";
import multiFiles_bodyParser from "../../middlewares/upload-multi-files/multi-files-bodyParser";

import { getOneProduct, postNewProcut, editProduct } from "./controllers";

const router = express.Router();

router.post(
  "/post-new-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  body_addProduct,
  bodyValidator,
  postNewProcut
);

router.post("/get-one-product", getOneProduct);

router.post("/edit-product", getImagesFromClient, editProduct);

export { router as adminRouter };
