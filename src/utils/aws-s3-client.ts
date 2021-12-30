import { S3Client } from "@aws-sdk/client-s3";
// import aws from "aws-sdk";

// aws.config.update({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID_MYAPP,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MYAPP,
//   },
// });

// you can find the region in the S3 management console
const REGION = "us-east-2";

// Create an Amazon S3 service client object.

// The credential is in the ".env" file, the AWS sdk will find that credential
// automatically while create the client
const s3Client = new S3Client({ region: REGION });

export { s3Client };
