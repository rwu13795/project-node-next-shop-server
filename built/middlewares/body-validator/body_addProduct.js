"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const body_addProduct = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title cannot be empty!"),
];
exports.default = body_addProduct;
//# sourceMappingURL=body_addProduct.js.map