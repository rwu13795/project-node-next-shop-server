import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../../utils/aws-s3-client";

export default async function deleteImages(images: string[]) {
  const str = "https://testing-images-on-s3.s3.us-east-2.amazonaws.com/";
  let params = {
    Bucket: "testing-images-on-s3",
    Key: "",
  };
  if (images?.length < 1 || !images) return;
  for (let i of images) {
    let key = i.slice(str.length);
    params.Key = key;
    await s3Client.send(new DeleteObjectCommand(params));
  }
}
