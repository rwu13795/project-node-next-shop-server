import { NextFunction, Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import {
  KidsProduct,
  WomenProduct,
  MenProduct,
} from "../../../models/product-schema";

// import { Stock } from "../../../models/stock";
import { s3Client } from "../../../util/aws-s3-client";

import {
  StockProps,
  ColorProps,
  ProductAttrs,
} from "../../../models/product-interfaces";
import { MainCategory, sizesArray } from "../../../models/product-enums";

export const postNewProcut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFiles = req.files;
  const {
    title,
    main_cat,
    sub_cat,
    price,
    colorPropsList,
    description,
  }: {
    title: string;
    main_cat: string;
    sub_cat: string;
    price: number;
    colorPropsList: ColorProps[];
    description: string;
  } = req.body;

  // put keywords in search tags
  const tagsRegex = /[\s-]+/g; // match all "space" and "dash-line"
  let searchTags: string[] = [...title.split(tagsRegex)];
  for (let e of colorPropsList) {
    searchTags.push(e.colorName);
  }

  const stock = mapStock(sizesArray, colorPropsList);

  const colorPropsList_withImageUrl = await uploadImageTo_S3(
    imageFiles,
    colorPropsList,
    main_cat,
    sub_cat,
    title
  );

  const productAttrs: ProductAttrs = {
    title,
    main_cat: main_cat.toLocaleLowerCase(),
    sub_cat: sub_cat.toLocaleLowerCase(),
    price,
    stock,
    searchTags,
    description,
    colorPropsList: colorPropsList_withImageUrl,
  };

  let product;
  switch (main_cat.toLocaleLowerCase()) {
    case MainCategory.men:
      product = MenProduct.build(productAttrs);
      break;
    case MainCategory.women:
      product = WomenProduct.build(productAttrs);
      break;
    case MainCategory.kids:
      product = KidsProduct.build(productAttrs);
      break;
    default:
      break;
  }

  await product.save();

  console.log("> > > new product added < < <");
  res.status(201).send({ message: "OK" });
};

function mapStock(
  sizesArray: string[],
  colorPropsList: ColorProps[]
): StockProps {
  let stock: StockProps = { byColor: {}, bySize: {} };
  for (let elem of colorPropsList) {
    let color = elem.colorName;
    let totalByColor = Object.values(elem.sizes).reduce((x, y) => x + y, 0);
    stock.byColor[color] = { ...elem.sizes, total: totalByColor };
    for (let size of sizesArray) {
      if (!stock.bySize[size]) {
        // NOTE have to initialize "bySize[size][color]" before we could assign a number to it
        stock.bySize[size] = { [color]: 0, total: 0 };
      }
      stock.bySize[size][color] = elem.sizes[size];
      stock.bySize[size].total = stock.bySize[size].total + elem.sizes[size];
    }
  }
  return stock;
  /**
     * stock:   
             {
               byColor: { 
                          red: { small: 3, medium: 55, large: 2 },
                          blue: { small: 44, medium: 1, large: 11 }
                        },
               bySize: { 
                        small: { blue: 44 }, 
                        medium: { blue: 1 }, 
                        large: { blue: 11 } 
                        }
              }
     */
}

async function uploadImageTo_S3(
  imageFiles,
  colorPropsList: ColorProps[],
  main_cat: string,
  sub_cat: string,
  title: string
): Promise<ColorProps[]> {
  // node does not support replaceAll(), need to use regex
  const allSpacesRegex = /\s/g;
  let urlTitle = title.replace(allSpacesRegex, "-");

  const categoryUrl = `${main_cat}/${sub_cat}/${urlTitle}`;
  const awsUrl = `https://testing-images-on-s3.s3.us-east-2.amazonaws.com/${categoryUrl}`;

  // Set the parameters for S#-client
  let params = {
    Bucket: "testing-images-on-s3", // The name of the bucket. For example, 'sample_bucket_101'.
    // The name of the object. For example, 'sample_upload.txt'. And the folder name will any
    // path in front of the file name, (testing_folder/xxxxx.txt)
    Key: "", // add the key dynamically for different images
    // The content of the object. For example, a string 'Hello world!" for txt file.
    // for image, put in the file-buffer created by the "multer"
    Body: "", // add the file-buffer dynamically for different images
  };

  let fileIndex = 0;
  for (let elem of colorPropsList) {
    let count = 1;
    if (!elem.imagesUrl) {
      elem.imagesUrl = [];
    }
    while (count <= elem.imagesCount) {
      let originalnameToUrl = imageFiles[fileIndex].originalname.replace(
        allSpacesRegex,
        "-"
      );
      // we need to attach tha category, title, and color to the url
      // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
      params.Key = `${categoryUrl}/${originalnameToUrl}`;
      params.Body = imageFiles[fileIndex].buffer;

      // put the url to colorProps imagesUrl
      elem.imagesUrl.push(awsUrl + `/${originalnameToUrl}`);

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
  }
  return colorPropsList;
}
