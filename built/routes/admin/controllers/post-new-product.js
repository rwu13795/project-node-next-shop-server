"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewItem = void 0;
const product_1 = require("../../../models/product");
const async_wrapper_1 = __importDefault(require("../../../middlewares/async-wrapper"));
exports.postNewItem = (0, async_wrapper_1.default)(async (req, res, next) => {
    // const image = req.file;
    // console.log(req.file);
    const { title, price, color, size, quantity } = req.body;
    const product = product_1.Product.build({
        title,
        price,
        colors: [color],
        sizes: [size],
        stock: {
            color: { [color]: { [size]: quantity } },
            size: { [size]: { [color]: quantity } },
        },
    });
    console.log(product._id);
    await product.save();
    res.status(201).send({ message: "OK", product });
});
/*if (!image) {
      return next(res.status(422).send({ message: "Missing image file!" }));
    }

    // let imageUrl = image.path.toString();
    // console.log(imageUrl);
    // const item = Items.build({ ...body });
    // await item.save();

    // console.log(item);

    // res.status(201).send(item);

    // Set the parameters
    const params = {
      Bucket: "testing-images-on-s3", // The name of the bucket. For example, 'sample_bucket_101'.
      // The name of the object. For example, 'sample_upload.txt'. And the folder name will any
      // path in front of the file name, (testing_folder/xxxxx.txt)
      Key: "images/cat-mask.jpg",
      // The content of the object. For example, a string 'Hello world!" for txt file.
      // for image, put in the file-buffer created by the "multer"
      Body: req.file.buffer,
    };

    // const data = await s3Client.send(
    //   new CreateBucketCommand({ Bucket: params.Bucket })
    // );

    // console.log(data);
    // console.log("Successfully created a bucket called ", data.Location);

    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key

      // the complete URL = "https//" + "params.Bucket" + ".s3.us-east-2.amazonaws.com/" + "params.Key"
    );

    // console.log(results);
 */
//# sourceMappingURL=post-new-product.js.map