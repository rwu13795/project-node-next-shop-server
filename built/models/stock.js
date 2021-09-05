"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    p_id: {
        type: String,
        required: true,
    },
    color: {
        type: Object,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
// change the default "__v" version property to "version"
stockSchema.set("versionKey", "version");
stockSchema.statics.build = (attrs) => {
    return new Stock(attrs);
};
const Stock = mongoose_1.default.model("Stock", stockSchema);
exports.Stock = Stock;
//# sourceMappingURL=stock.js.map