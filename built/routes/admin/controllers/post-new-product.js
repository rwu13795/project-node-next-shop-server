"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewProcut = void 0;
// import { Stock } from "../../../models/stock";
const async_wrapper_1 = __importDefault(require("../../../middlewares/async-wrapper"));
exports.postNewProcut = (0, async_wrapper_1.default)(async (req, res, next) => {
    const imageFiles = req.files;
    const document = JSON.parse(req.body.document);
    const { title, main_cat, sub_cat, price, colorProps, description } = document;
    console.log(title, main_cat, sub_cat, price, colorProps, description);
    console.log(imageFiles);
    const sizeArray = ["small", "medium", "large"];
    /**
     *   colorProps: [
     *        {
     *          colorAndSize: {color: 'white', small: '11', medium: '22', large: '31'},
     *          imagesCount: 2
     *        },
     *        {
     *          colorAndSize: {color: 'red', small: '5', medium: '99', large: '23'},
     *          imagesCount: 4
     *        }
     *      ]
     */
    // let colorArray = Object.keys(colorProps);
    // // map the stock by colors and sizes
    // let stock: StockProps = { byColor: {}, bySize: {} };
    // for (let color of colorArray) {
    //   stock.byColor[color] = { ...colorProps[color].sizes };
    //   for (let size of sizeArray) {
    //     // have to initialize the "stock.bySize[size]" before we could access the [color]
    //     stock.bySize[size] = {};
    //     stock.bySize[size][color] = colorProps[color].sizes[size];
    //   }
    // }
    /* example stock:
             {
               byColor: {
                 red: { small: 3, medium: 55, large: 2 },
                 blue: { small: 44, medium: 1, large: 11 }
               },
               bySize: { small: { blue: 44 }, medium: { blue: 1 }, large: { blue: 11 } }
             }
     */
    // const product = Product.build({
    //   title,
    //   main_cat,
    //   sub_cat,
    //   price,
    //   colors: colorArray,
    //   sizes: sizeArray,
    //   stock,
    //   imageUrl: {
    //     ["red"]: {
    //       main: "https://testing-images-on-s3.s3.us-east-2.amazonaws.com/images/t-1.jpg",
    //       sub: [
    //         "https://testing-images-on-s3.s3.us-east-2.amazonaws.com/images/t-1.jpg",
    //       ],
    //     },
    //   },
    //   description,
    // });
    // await product.save();
    console.log("> > > Admin - added new product < < <");
    res.status(201).send({ message: "OK" });
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