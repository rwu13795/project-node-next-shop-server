import AWS from "aws-sdk";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

const publicAccessId = process.env.CF_PUBLIC_ACCESS_ID;

const privateKey = process.env.CF_PRIVATE_KEY;

const cloudFront_signer = new AWS.CloudFront.Signer(publicAccessId, privateKey);

export default cloudFront_signer;
