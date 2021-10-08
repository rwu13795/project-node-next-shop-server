import express from "express";

import {
  body_signIn,
  body_signUp,
  csrf_protection_user,
  requestValidator,
} from "../../middlewares";
import {
  getUserStatus,
  signIn,
  signOut,
  signUp,
  updateInfo,
} from "./controllers";

const router = express.Router();

router.get("/user-status", getUserStatus);

router.post("/sign-in", body_signIn, requestValidator, signIn);

router.post("/sign-out", signOut);

router.post("/sign-up", body_signUp, requestValidator, signUp);

router.post("/reset-request");

router.post("/reset-pw");

router.post("/reset-ckeck-token");

router.post("/update-info", csrf_protection_user, updateInfo);

export { router as authRouter };
