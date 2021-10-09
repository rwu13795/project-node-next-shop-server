import { body } from "express-validator";
import { inputNames } from "../../utils/enums/input-names";

export const body_signIn = [
  body(inputNames.email).isEmail().withMessage("Email must be valid"),
  body(inputNames.password)
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];
