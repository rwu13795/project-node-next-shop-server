import { NextFunction, Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { Product } from "../../../models/product";
// import { Stock } from "../../../models/stock";
import { s3Client } from "../../../util/aws-s3-client";

import { StockProps, ImagesUrlProps, ColorPair } from "../../../models/product";

interface ColorProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imagesCount: number;
}

export const postNewProcut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFiles = req.files;

  console.log(">>>>>> in post", req.body.description);

  // const {
  //   title,
  //   main_cat,
  //   sub_cat,
  //   price,
  //   colorProps,
  //   description,
  // }: {
  //   title: string;
  //   main_cat: string;
  //   sub_cat: string;
  //   price: number;
  //   colorProps: ColorProps[];
  //   description: string;
  // } = document;

  // const sizesArray = ["small", "medium", "large"];
  // let searchTags: string[] = [...title.split(" ")];

  // let colorPairArray: ColorPair[] = [];
  // for (let e of colorProps) {
  //   colorPairArray.push({ [e.colorName]: e.colorCode });
  //   searchTags.push(e.colorName);
  // }

  // const stock = mapStock(sizesArray, colorProps);

  // const imagesUrl = await uploadImageTo_S3(
  //   imageFiles,
  //   colorProps,
  //   main_cat,
  //   sub_cat,
  //   title
  // );

  // const product = Product.build({
  //   title,
  //   main_cat,
  //   sub_cat,
  //   price,
  //   colors: colorPairArray,
  //   sizes: sizesArray,
  //   stock,
  //   searchTags,
  //   imagesUrl,
  //   description,
  // });

  // await product.save();

  console.log("> > > new product added < < <");
  res.status(201).send({ message: "OK" });
};

function mapStock(sizesArray: string[], colorProps: ColorProps[]): StockProps {
  let stock: StockProps = { byColor: {}, bySize: {} };
  for (let elem of colorProps) {
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
  colorProps: ColorProps[],
  main_cat: string,
  sub_cat: string,
  title: string
) {
  // node does not support replaceAll(), need to use regex
  const allSpacesRegex = /\s/g;
  let urlTitle = title.replace(allSpacesRegex, "-");
  let imagesUrl: ImagesUrlProps = {};

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
  for (let elem of colorProps) {
    // initialize the props
    if (!imagesUrl[elem.colorName]) {
      imagesUrl[elem.colorName] = { main: "", sub: [] };
    }
    let count = 1;
    while (count <= elem.imagesCount) {
      let originalnameToUrl = imageFiles[fileIndex].originalname.replace(
        allSpacesRegex,
        "-"
      );
      // we need to attach tha category, title, and color to the url
      // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
      params.Key = `${categoryUrl}/${originalnameToUrl}`;
      params.Body = imageFiles[fileIndex].buffer;

      // put the url to imagesUrl
      if (count === 1) {
        imagesUrl[elem.colorName].main = awsUrl + `/${originalnameToUrl}`;
      } else {
        imagesUrl[elem.colorName].sub.push(awsUrl + `/${originalnameToUrl}`);
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
  }
  return imagesUrl;
}
