import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// import { Items } from "../../../models/items";
import asyncWrapper from "../../../middlewares/async-wrapper";
import { s3Client } from "../../../util/aws-s3-client";

export const postNewItem = asyncWrapper(async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);

  // const item = Items.build({ ...body });
  // await item.save();

  // console.log(item);

  // res.status(201).send(item);

  // Set the parameters
  const params = {
    Bucket: "testing-images-on-s3", // The name of the bucket. For example, 'sample_bucket_101'.
    Key: "sample_upload2.txt", // The name of the object. For example, 'sample_upload.txt'.
    Body: "Hello world 2!", // The content of the object. For example, 'Hello world!".
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
  );

  console.log(results);

  res.status(201).send({ message: "OK" });
});
