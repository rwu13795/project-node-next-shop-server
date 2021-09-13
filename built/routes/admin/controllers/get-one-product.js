"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneProduct = void 0;
const async_wrapper_1 = __importDefault(require("../../../middlewares/async-wrapper"));
const not_found_error_1 = require("../../../middlewares/error-handler/not-found-error");
const product_1 = require("../../../models/product");
exports.getOneProduct = (0, async_wrapper_1.default)(async (req, res, next) => {
    const { color, size, id } = req.body;
    // use the "$in : [value]" to find one with such value in an array
    // specify the nested object property in a string `stock.byColor.${color}.total`
    const objectPath = `stock.byColor.${color}.total`;
    console.log(objectPath);
    const product = await product_1.Product.find({ [objectPath]: { $gt: 0 } }).lean();
    if (product.length < 1) {
        return next(new not_found_error_1.NotFoundError());
    }
    if (id.length !== 24) {
        return next(new not_found_error_1.NotFoundError());
    }
    // const product = await Product.findById(id);
    // console.log(product);
    // if (!product) {
    //   return next(new notFoundError());
    // }
    res.status(200).send({ message: "OK", result: product });
});
//# sourceMappingURL=get-one-product.js.map