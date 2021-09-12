import { NextFunction, Request, Response } from "express";
import multer from "multer";

import getImagesFromClient from "../../../middlewares/upload-multi-files/get-image-files";

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // error handling of multer
  getImagesFromClient(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  });

  let colorsArray = ["red", "blue"];

  let images = req.files;
  const colors = JSON.parse(req.body.document);

  console.log(colors);

  let imagesIndex = 0;
  for (let c of colorsArray) {
    let count = 1;
    while (count <= colors[c].imagesCount) {
      // here is where we extract the buffer and upload it to the AWS
      // we need to attach tha category, title, and color to the url
      // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
      console.log(c + ": " + images[imagesIndex].originalname);
      count++;
      imagesIndex++;
    }
  }

  res.status(201).send({ message: "OK" });
};
