"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProduct = void 0;
const multer_1 = __importDefault(require("multer"));
const upload_images_1 = require("../../../middlewares/upload-images");
const editProduct = async (req, res, next) => {
    // error handling of multer
    (0, upload_images_1.uploadImages)(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred when uploading.
        }
        else if (err) {
            // An unknown error occurred when uploading.
        }
        // Everything went fine.
    });
    let colorsArray = ["red", "blue"];
    let images = req.files;
    const colors = JSON.parse(req.body.document);
    console.log(colors);
    let imagesIndex = 0;
    for (let c of colorsArray) {
        let count = 1;
        while (count <= colors[c].imagesCount) {
            // here is where we extract the buffer and upload it to the AWS
            // we need to attach tha category, title, and color to the url
            // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
            console.log(c + ": " + images[imagesIndex].originalname);
            count++;
            imagesIndex++;
        }
    }
    res.status(201).send({ message: "OK" });
};
exports.editProduct = editProduct;
//# sourceMappingURL=edit-product.js.map