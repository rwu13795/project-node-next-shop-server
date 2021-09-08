"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const upload_images_1 = require("../../middlewares/upload-images");
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
exports.adminRouter = router;
router.post("/post-new-product", upload_images_1.uploadImages, controllers_1.postNewProcut);
router.post("/get-one-product", controllers_1.getOneProduct);
router.post("/edit-product", upload_images_1.uploadImages, controllers_1.editProduct);
//# sourceMappingURL=router.js.map