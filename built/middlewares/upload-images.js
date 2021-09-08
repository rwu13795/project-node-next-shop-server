"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
const multer_1 = __importDefault(require("multer"));
// the filter also works for "multer.array", it will check each file inside the array
const fileFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
exports.uploadImages = (0, multer_1.default)({ fileFilter: fileFilter }).array("uploaded_images");
// all the uploaded_images objects are inside one single array,
// we need to use the ["color"].url.imagesCount to extract the image-files for each color in the array
//# sourceMappingURL=upload-images.js.map