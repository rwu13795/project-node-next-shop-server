"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWomenItems = void 0;
const async_wrapper_1 = __importDefault(require("../../../middlewares/async-wrapper"));
exports.getAllWomenItems = (0, async_wrapper_1.default)(async (req, res) => {
    res.status(200).send({ message: "OK, women" });
});
//# sourceMappingURL=get-all-women.js.map