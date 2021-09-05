"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
exports.itemsRouter = router;
router.get("/men", controllers_1.getAllMenItems);
router.get("/women", controllers_1.getAllWomenItems);
//# sourceMappingURL=router.js.map