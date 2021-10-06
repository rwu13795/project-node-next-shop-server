import express from "express";
import {
  body_addProduct,
  requestValidator,
  getImagesFromClient,
  multiFiles_bodyParser,
  body_adminRegister,
} from "../../middlewares";

import {
  addProduct,
  editProduct,
  deleteProduct,
  adminSignIn,
  adminRegister,
  getAdminStatus,
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

router.get("/admin-status", getAdminStatus);

router.post("/admin-sign-in", adminSignIn);

router.post(
  "/admin-register",
  body_adminRegister,
  requestValidator,
  adminRegister
);

export { router as adminRouter };
