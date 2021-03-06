import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../../utils/aws-s3-client";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

export default async function deleteImages(images: string[]) {
  const str = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_BUCKET_REGION}/`;

  let params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "",
  };
  if (images?.length < 1 || !images) return;
  for (let i of images) {
    let key = i.slice(str.length);
    if (key.slice(0, 12) === "other-images") {
      continue;
    }
    params.Key = key;
    await s3Client.send(new DeleteObjectCommand(params));
  }
}
