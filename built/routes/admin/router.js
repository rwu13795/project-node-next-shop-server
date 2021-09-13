"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const body_addProduct_1 = __importDefault(require("../../middlewares/request-validator/body-addProduct"));
const validator_1 = __importDefault(require("../../middlewares/request-validator/validator"));
const get_image_files_1 = __importDefault(require("../../middlewares/upload-multi-files/get-image-files"));
const multi_files_bodyParser_1 = __importDefault(require("../../middlewares/upload-multi-files/multi-files-bodyParser"));
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
exports.adminRouter = router;
router.post("/post-new-product", get_image_files_1.default, multi_files_bodyParser_1.default, body_addProduct_1.default, validator_1.default, controllers_1.postNewProcut);
router.post("/get-one-product", controllers_1.getOneProduct);
router.post("/edit-product", get_image_files_1.default, controllers_1.editProduct);
//# sourceMappingURL=router.js.map