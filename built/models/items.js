"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Items = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const itemsSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // userId: {
    //   type: String,
    //   required: true,
    // },
    orderId: {
        type: String, // default - required: false,
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
itemsSchema.set("versionKey", "version");
itemsSchema.statics.build = (attrs) => {
    return new Items(attrs);
};
const Items = mongoose_1.default.model("Items", itemsSchema);
exports.Items = Items;
//# sourceMappingURL=items.js.map