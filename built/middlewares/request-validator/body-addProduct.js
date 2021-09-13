"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// the client-site check should be able to prevent user sending invalid data
// this body validator is action as the second check
const body_addProduct = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title cannot be empty"),
    (0, express_validator_1.body)("main_cat").notEmpty().withMessage("Main category cannot be empty"),
    (0, express_validator_1.body)("sub_cat").notEmpty().withMessage("Sub category cannot be empty"),
    // (1) //
    (0, express_validator_1.body)("colorProps")
        .custom((value, { req }) => {
        for (let elem of req.body.colorProps) {
            if (elem.colorName === "" || elem.colorName === undefined) {
                return false; // returning "false" means "not validated"
            }
        }
        return true;
    })
        .withMessage("colorName"),
    // have to use the message to indicate specific error field, since the "param" will
    // be "colorProps" for all element inside this colorProps array
    (0, express_validator_1.body)("colorProps")
        .custom((value, { req }) => {
        for (let elem of req.body.colorProps) {
            if (elem.colorCode === "" || elem.colorCode === undefined) {
                return false; // returning "false" means "not validated"
            }
        }
        return true;
    })
        .withMessage("colorCode"),
    (0, express_validator_1.body)("colorProps")
        .custom((value, { req }) => {
        for (let elem of req.body.colorProps) {
            if (elem.imagesCount < 1) {
                return false; // returning "false" means "not validated"
            }
        }
        return true;
    })
        .withMessage("imagesCount"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description cannot be empty"),
];
exports.default = body_addProduct;
/**
 *  (1) use the custom validation to check the values of each element in the colorProps array
 */
//# sourceMappingURL=body-addProduct.js.map