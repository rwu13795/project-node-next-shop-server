"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewProcut = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const product_1 = require("../../../models/product");
// import { Stock } from "../../../models/stock";
const aws_s3_client_1 = require("../../../util/aws-s3-client");
const postNewProcut = async (req, res, next) => {
    const imageFiles = req.files;
    const document = JSON.parse(req.body.document);
    const { title, main_cat, sub_cat, price, colorProps, description, } = document;
    const sizesArray = ["small", "medium", "large"];
    let searchTags = [...title.split(" ")];
    let colorPairArray = [];
    for (let e of colorProps) {
        colorPairArray.push({ [e.colorName]: e.colorCode });
        searchTags.push(e.colorName);
    }
    const stock = mapStock(sizesArray, colorProps);
    const imagesUrl = await uploadImageTo_S3(imageFiles, colorProps, main_cat, sub_cat, title);
    const product = product_1.Product.build({
        title,
        main_cat,
        sub_cat,
        price,
        colors: colorPairArray,
        sizes: sizesArray,
        stock,
        searchTags,
        imagesUrl,
        description,
    });
    await product.save();
    console.log("> > > new product added < < <");
    res.status(201).send({ message: "OK" });
};
exports.postNewProcut = postNewProcut;
function mapStock(sizesArray, colorProps) {
    let stock = { byColor: {}, bySize: {} };
    for (let elem of colorProps) {
        let color = elem.colorName;
        let totalByColor = Object.values(elem.sizes).reduce((x, y) => x + y, 0);
        stock.byColor[color] = Object.assign(Object.assign({}, elem.sizes), { total: totalByColor });
        for (let size of sizesArray) {
            if (!stock.bySize[size]) {
                // NOTE have to initialize "bySize[size][color]" before we could assign a number to it
                stock.bySize[size] = { [color]: 0, total: 0 };
            }
            stock.bySize[size][color] = elem.sizes[size];
            stock.bySize[size].total = stock.bySize[size].total + elem.sizes[size];
        }
    }
    return stock;
    /**
       * stock:
               {
                 byColor: {
                            red: { small: 3, medium: 55, large: 2 },
                            blue: { small: 44, medium: 1, large: 11 }
                          },
                 bySize: {
                          small: { blue: 44 },
                          medium: { blue: 1 },
                          large: { blue: 11 }
                          }
                }
       */
}
async function uploadImageTo_S3(imageFiles, colorProps, main_cat, sub_cat, title) {
    // node does not support replaceAll(), need to use regex
    const allSpacesRegex = /\s/g;
    let urlTitle = title.replace(allSpacesRegex, "-");
    let imagesUrl = {};
    const categoryUrl = `${main_cat}/${sub_cat}/${urlTitle}`;
    const awsUrl = `https://testing-images-on-s3.s3.us-east-2.amazonaws.com/${categoryUrl}`;
    // Set the parameters for S#-client
    let params = {
        Bucket: "testing-images-on-s3",
        // The name of the object. For example, 'sample_upload.txt'. And the folder name will any
        // path in front of the file name, (testing_folder/xxxxx.txt)
        Key: "",
        // The content of the object. For example, a string 'Hello world!" for txt file.
        // for image, put in the file-buffer created by the "multer"
        Body: "", // add the file-buffer dynamically for different images
    };
    let fileIndex = 0;
    for (let elem of colorProps) {
        // initialize the props
        if (!imagesUrl[elem.colorName]) {
            imagesUrl[elem.colorName] = { main: "", sub: [] };
        }
        let count = 1;
        while (count <= elem.imagesCount) {
            let originalnameToUrl = imageFiles[fileIndex].originalname.replace(allSpacesRegex, "-");
            // we need to attach tha category, title, and color to the url
            // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
            params.Key = `${categoryUrl}/${originalnameToUrl}`;
            params.Body = imageFiles[fileIndex].buffer;
            // put the url to imagesUrl
            if (count === 1) {
                imagesUrl[elem.colorName].main = awsUrl + `/${originalnameToUrl}`;
            }
            else {
                imagesUrl[elem.colorName].sub.push(awsUrl + `/${originalnameToUrl}`);
            }
            // upload to S3
            try {
                await aws_s3_client_1.s3Client.send(new client_s3_1.PutObjectCommand(params));
                console.log(`> > > uploaded image: ${originalnameToUrl}`);
            }
            catch (err) {
                console.log(err);
            }
            count++;
            fileIndex++;
        }
    }
    return imagesUrl;
}
//# sourceMappingURL=post-new-product.js.map