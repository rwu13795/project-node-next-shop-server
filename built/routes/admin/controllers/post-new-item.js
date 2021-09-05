"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewItem = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
// import { Items } from "../../../models/items";
const async_wrapper_1 = __importDefault(require("../../../middlewares/async-wrapper"));
const aws_s3_client_1 = require("../../../util/aws-s3-client");
exports.postNewItem = (0, async_wrapper_1.default)(async (req, res) => {
    const body = req.body;
    console.log(body);
    // const item = Items.build({ ...body });
    // await item.save();
    // console.log(item);
    // res.status(201).send(item);
    // Set the parameters
    const params = {
        Bucket: "testing-images-on-s3",
        Key: "sample_upload2.txt",
        Body: "Hello world 2!", // The content of the object. For example, 'Hello world!".
    };
    // const data = await s3Client.send(
    //   new CreateBucketCommand({ Bucket: params.Bucket })
    // );
    // console.log(data);
    // console.log("Successfully created a bucket called ", data.Location);
    const results = await aws_s3_client_1.s3Client.send(new client_s3_1.PutObjectCommand(params));
    console.log("Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key);
    console.log(results);
    res.status(201).send({ message: "OK" });
});
//# sourceMappingURL=post-new-item.js.map