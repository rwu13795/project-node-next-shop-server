import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";

import { s3Client } from "../../../utils/aws-s3-client";
import { ColorPropsFromClient } from "../controllers/add-product";
import { ColorProps } from "../../../models/product/product-interfaces";
import { UploadedImages } from "../../../middlewares";

interface Params {
  Bucket: string;
  Key: string;
  Body: string | Buffer;
}

if (process.env.NODE_ENV !== "production") {
  config();
}

export default async function uploadImageTo_S3(
  editMode: boolean,
  uploadedImageFiles: UploadedImages,
  colorPropsListFromClient: ColorPropsFromClient[],
  main_cat: string,
  sub_cat: string,
  title: string
): Promise<ColorProps[]> {
  // node does not support replaceAll(), need to use regex
  const allSpacesRegex = /\s/g;
  let urlTitle = title.replace(allSpacesRegex, "-");

  const categoryUrl = `${main_cat}/${sub_cat}/${urlTitle}`;
  const awsUrl = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_BUCKET_REGION}/${categoryUrl}`;

  let params: Params = {
    Bucket: process.env.S3_BUCKET_NAME, // The name of the bucket. For example, 'sample_bucket_101'.
    // The name of the object. For example, 'sample_upload.txt'. And the folder name will any
    // path in front of the file name, (testing_folder/xxxxx.txt)
    Key: "", // add the key dynamically for different images
    // The content of the object. For example, a string 'Hello world!" for txt file.
    // for image, put in the file-buffer created by the "multer"
    Body: "", // add the file-buffer dynamically for different images
  };

  let colorPropsList: ColorProps[] = [];
  let fileIndex = 0;
  for (let prop of colorPropsListFromClient) {
    let count = 0;
    while (count < (editMode ? prop.modifiedIndex.length : prop.imageCount)) {
      let originalnameToUrl: string = uploadedImageFiles[
        fileIndex
      ].originalname.replace(allSpacesRegex, "-");
      // we need to attach the category, title, and color to the url
      // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
      params.Key = `${categoryUrl}/${originalnameToUrl}`;
      params.Body = uploadedImageFiles[fileIndex].buffer;

      if (editMode) {
        // replace the new image url inside the array where marked as "modified"
        prop.modifiedImages[prop.modifiedIndex[count]] =
          awsUrl + `/${originalnameToUrl}`;
      } else {
        if (!prop.imageFiles) {
          prop.imageFiles = [];
        }
        prop.imageFiles.push(awsUrl + `/${originalnameToUrl}`);
      }

      // upload to S3
      try {
        await s3Client.send(new PutObjectCommand(params));
        console.log(`> > > uploaded image: ${originalnameToUrl}`);
      } catch (err) {
        console.log(err);
      }
      count++;
      fileIndex++;
    }
    if (editMode) {
      colorPropsList.push({
        colorCode: prop.colorCode,
        colorName: prop.colorName,
        sizes: prop.sizes,
        imageCount: prop.imageCount,
        imageFiles: prop.modifiedImages as string[],
      });
    }
  }
  return editMode ? colorPropsList : colorPropsListFromClient;
}
