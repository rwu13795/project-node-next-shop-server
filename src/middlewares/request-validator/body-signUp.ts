import { body } from "express-validator";

export const body_signUp = [
  body("firstName").notEmpty().withMessage("First name required"),
  body("lastName").notEmpty().withMessage("Last name required"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("comfirmPassword").trim().isLength({ min: 4, max: 20 }),
  body("password")
    .custom((value, { req }) => {
      if (value.trim() !== req.body.comfirmPassword.trim()) {
        // console.log(value, req.body.confirmPassword);
        return false;
      }
      return true;
    })
    .withMessage("The passwords do not match"),
];
