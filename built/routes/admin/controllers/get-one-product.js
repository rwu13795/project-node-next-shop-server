"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneProduct = void 0;
const async_wrapper_1 = __importDefault(require("../../../middlewares/async-wrapper"));
const product_1 = require("../../../models/product");
exports.getOneProduct = (0, async_wrapper_1.default)(async (req, res, next) => {
    const { p_id } = req.body;
    const product = await product_1.Product.findById({ _id: p_id });
    await product.populate("stock_ref");
    res.status(200).send({ message: "OK", result: product });
});
//# sourceMappingURL=get-one-product.js.map