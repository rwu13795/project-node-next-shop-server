"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
// you can find the region in the S3 management console
const REGION = "us-east-2";
// Create an Amazon S3 service client object.
// The credential is in the ".env" file, the AWS sdk will find that credential
// automatically while create the client
const s3Client = new client_s3_1.S3Client({ region: REGION });
exports.s3Client = s3Client;
//# sourceMappingURL=aws-s3-client.js.map