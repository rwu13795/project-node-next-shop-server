import { body } from "express-validator";

export const body_adminRegister = [
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("confirm_password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("password")
    .custom((value, { req }) => {
      if (value.trim() !== req.body.confirm_password.trim()) {
        return false;
      }
      return true;
    })
    .withMessage("The passwords do not match"),
  body("confirm_password")
    .custom((value, { req }) => {
      if (value.trim() !== req.body.password.trim()) {
        return false;
      }
      return true;
    })
    .withMessage("The passwords do not match"),
];