"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
exports.productRouter = router;
router.get("/", controllers_1.getProducts);
router.get("/:category", controllers_1.getProducts);
router.get("/:category/:sub_category", controllers_1.getProducts);
router.get("/detail/:productId", controllers_1.getProductDetail);
//# sourceMappingURL=router.js.map