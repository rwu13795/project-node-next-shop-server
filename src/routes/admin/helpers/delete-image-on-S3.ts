import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../../utils/aws-s3-client";

export default async function deleteImages(images: string[]) {
  let params = {
    Bucket: "testing-images-on-s3",
    Key: "",
  };
  for (let i of images) {
    let key = i.slice(56);
    params.Key = key;
    await s3Client.send(new DeleteObjectCommand(params));
  }
}
