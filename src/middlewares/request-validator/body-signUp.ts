import { body } from "express-validator";
import { inputNames } from "../../utils/enums/input-names";

export const body_signUp = [
  body("userInfo.first_name").notEmpty().withMessage("First name required"),
  body("userInfo.last_name").notEmpty().withMessage("Last name required"),
  body(inputNames.email).isEmail().withMessage("Email must be valid"),
  body(inputNames.password)
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body(inputNames.confirm_password)
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body(inputNames.password)
    .custom((value, { req }) => {
      if (value.trim() !== req.body.confirm_password.trim()) {
        return false;
      }
      return true;
    })
    .withMessage("The passwords do not match"),
  body(inputNames.confirm_password)
    .custom((value, { req }) => {
      if (value.trim() !== req.body.password.trim()) {
        return false;
      }
      return true;
    })
    .withMessage("The passwords do not match"),
];
