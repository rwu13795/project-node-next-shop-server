import express from "express";
import {
  body_addProduct,
  requestValidator,
  getImagesFromClient,
  multiFiles_bodyParser,
  body_adminRegister,
  csrf_protection_admin,
  requireAdminAuth,
} from "../../middlewares";

import {
  addProduct,
  editProduct,
  deleteProduct,
  adminSignIn,
  adminRegister,
  getAdminStatus,
  getProductsList,
  adminSignOut,
  getMasterProductsList,
} from "./controllers";

const router = express.Router();

router.post(
  "/add-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  requireAdminAuth,
  csrf_protection_admin,
  body_addProduct,
  requestValidator,
  addProduct
);

// router.post("/get-one-product", getOneProduct);

router.post(
  "/edit-product",
  getImagesFromClient,
  multiFiles_bodyParser,
  requireAdminAuth,
  csrf_protection_admin,
  body_addProduct,
  requestValidator,
  editProduct
);

router.post(
  "/delete-product",
  requireAdminAuth,
  csrf_protection_admin,
  deleteProduct
);

router.get("/admin-status", getAdminStatus);

router.post("/admin-sign-in", adminSignIn);

router.post("/admin-sign-out", adminSignOut);

router.post(
  "/admin-register",
  body_adminRegister,
  requestValidator,
  adminRegister
);

router.get("/get-products-list", requireAdminAuth, getProductsList);

router.get(
  "/get-master-products-list",
  requireAdminAuth,
  getMasterProductsList
);

export { router as adminRouter };
