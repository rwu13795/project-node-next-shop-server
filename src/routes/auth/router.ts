import express from "express";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

import {
  body_resetPassword,
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
  resetPassword,
  forgotPassword_Request,
  forgotPassword_Reset,
  tokenCheck,
} from "./controllers";

export const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

const router = express.Router();

router.get("/user-status", getUserStatus);

router.post("/sign-in", body_signIn, requestValidator, signIn);

router.post("/sign-out", signOut);

router.post("/sign-up", body_signUp, requestValidator, signUp);

router.post("/forgot-password-request", forgotPassword_Request);

router.post(
  "/forgot-password-reset",
  body_resetPassword,
  requestValidator,
  forgotPassword_Reset
);

router.post(
  "/reset-password",
  csrf_protection_user,
  body_resetPassword,
  requestValidator,
  resetPassword
);

router.post("/token-check", tokenCheck);

router.post("/update-info", csrf_protection_user, updateInfo);

export { router as authRouter };
