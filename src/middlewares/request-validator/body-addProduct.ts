import { body } from "express-validator";
import { inputNames } from "../../utils/enums/input-names";

// the client-site check should be able to prevent user sending invalid data
// this body validator is action as the second check
export const body_addProduct = [
  body(inputNames.title).notEmpty().withMessage("Title cannot be empty"),
  body(inputNames.main).notEmpty().withMessage("Main category cannot be empty"),
  body(inputNames.sub).notEmpty().withMessage("Sub category cannot be empty"),
  // (1) //
  body(inputNames.price)
    .custom((value, { req }) => {
      if (isNaN(value) || value === "" || value === null) {
        return false; // returning "false" means "not validated"
      }
      return true;
    })
    .withMessage("Please enter a valid price"),
  body("colorPropsListFromClient")
    .custom((value, { req }) => {
      for (let elem of req.body.colorPropsListFromClient) {
        if (elem.colorName === "" || elem.colorName === undefined) {
          return false; // returning "false" means "not validated"
        }
      }
      return true;
    })
    .withMessage(inputNames.colorName),
  // have to use the message to indicate specific error field, since the "param" will
  // be "colorProps" for all element inside this colorProps array
  body("colorPropsListFromClient")
    .custom((value, { req }) => {
      for (let elem of req.body.colorPropsListFromClient) {
        if (elem.colorCode === "" || elem.colorCode === undefined) {
          return false; // returning "false" means "not validated"
        }
      }
      return true;
    })
    .withMessage(inputNames.colorCode),
  body("colorPropsListFromClient")
    .custom((value, { req }) => {
      for (let elem of req.body.colorPropsListFromClient) {
        console.log("ckeck size props", elem.sizes.small === null);
        if (
          isNaN(elem.sizes.small) ||
          elem.sizes.small === "" ||
          elem.sizes.small === null ||
          isNaN(elem.sizes.medium) ||
          elem.sizes.medium === "" ||
          elem.sizes.medium === null ||
          isNaN(elem.sizes.large) ||
          elem.sizes.large === "" ||
          elem.sizes.large === null
        ) {
          return false; // returning "false" means "not validated"
        }
      }
      return true;
    })
    .withMessage(inputNames.size),
  body("colorPropsListFromClient")
    .custom((value, { req }) => {
      for (let elem of req.body.colorPropsListFromClient) {
        if (elem.imageCount < 1) {
          return false; // returning "false" means "not validated"
        }
      }
      return true;
    })
    .withMessage(inputNames.imagesCount),
  body(inputNames.desc).notEmpty().withMessage("Description cannot be empty"),
];

/**
 *  (1) use the custom validation to check the values of each element in the colorProps array
 */
