import { Request } from "express";

import multer from "multer";

export type UploadedImages =
  | Express.Multer.File[]
  | {
      [fieldname: string]: Express.Multer.File[];
    };

// the filter also works for "multer.array", it will check each file inside the array
const fileFilter = (req: Request, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // I can add file.extension here depending on the mimetype
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const getImagesFromClient = multer({ fileFilter: fileFilter }).array(
  "uploaded_images"
);

// all the uploaded_images objects are inside one single array,
// we need to use the ["color"].url.imagesCount to extract the image-files for each color in the array
