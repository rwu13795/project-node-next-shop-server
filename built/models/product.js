"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    main_cat: { type: String, required: true },
    sub_cat: { type: String, required: true },
    price: { type: Number, required: true },
    colors: { type: Array, required: true },
    sizes: { type: Array, required: true },
    stock: {
        byColor: { type: Object, required: true },
        bySize: { type: Object, required: true },
    },
    imageUrl: { type: Object, required: true },
    description: { type: String, required: true },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
// change the default "__v" version property to "version"
productSchema.set("versionKey", "version");
productSchema.statics.build = (attrs) => {
    return new Product(attrs);
};
const Product = mongoose_1.default.model("Product", productSchema);
exports.Product = Product;
//# sourceMappingURL=product.js.map