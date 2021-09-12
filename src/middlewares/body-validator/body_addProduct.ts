import { body } from "express-validator";

const body_addProduct = [
  body("title").notEmpty().withMessage("Title cannot be empty!"),
];

export default body_addProduct;
