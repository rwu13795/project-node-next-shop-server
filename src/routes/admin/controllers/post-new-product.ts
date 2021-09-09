import { NextFunction, Request, Response } from "express";
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";

import { Product } from "../../../models/product";
// import { Stock } from "../../../models/stock";
import asyncWrapper from "../../../middlewares/async-wrapper";
import { s3Client } from "../../../util/aws-s3-client";

import { StockProps, ImagesUrlProps } from "../../../models/product";

interface ColorProps {
  color: string;
  sizes: { [name: string]: number };
  imagesCount: number;
}

export const postNewProcut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFiles = req.files;
  const document = JSON.parse(req.body.document);

  const {
    title,
    main_cat,
    sub_cat,
    price,
    colorProps,
    description,
  }: {
    title: string;
    main_cat: string;
    sub_cat: string;
    price: number;
    colorProps: ColorProps[];
    description: string;
  } = document;

  const sizesArray = ["small", "medium", "large"];
  let colorsArray: string[] = [];
  for (let e of colorProps) {
    colorsArray.push(e.color);
  }

  const stock = mapStock(sizesArray, colorProps);

  const imagesUrl = await uploadImageTo_S3(
    imageFiles,
    colorProps,
    main_cat,
    sub_cat,
    title
  );

  console.log(imagesUrl);

  // const product = Product.build({
  //   title,
  //   main_cat,
  //   sub_cat,
  //   price,
  //   colors: colorArray,
  //   sizes: sizeArray,
  //   stock,
  //   imageUrl: {
  //     ["red"]: {
  //       main: "https://testing-images-on-s3.s3.us-east-2.amazonaws.com/images/t-1.jpg",
  //       sub: [
  //         "https://testing-images-on-s3.s3.us-east-2.amazonaws.com/images/t-1.jpg",
  //       ],
  //     },
  //   },
  //   description,
  // });

  // await product.save();

  res.status(201).send({ message: "OK" });
};

function mapStock(sizesArray: string[], colorProps: ColorProps[]): StockProps {
  let stock: StockProps = { byColor: {}, bySize: {} };
  for (let elem of colorProps) {
    let color = elem.color;
    stock.byColor[color] = { ...elem.sizes };
    for (let size of sizesArray) {
      if (!stock.bySize[size]) {
        // NOTE have to initialize "bySize[size][color]" before we could assign a number to it
        stock.bySize[size] = { [color]: 0 };
      }
      stock.bySize[size][color] = elem.sizes[size];
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
  let imagesUrl: ImagesUrlProps = {};
  let categoryUrl = `${main_cat}/${sub_cat}/${title}`;
  let awsUrl = `https://testing-images-on-s3.s3.us-east-2.amazonaws.com/${categoryUrl}`;

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
    if (!imagesUrl[elem.color]) {
      imagesUrl[elem.color] = { main: "", sub: [] };
    }
    let count = 1;
    while (count <= elem.imagesCount) {
      // we need to attach tha category, title, and color to the url
      // aws.com/images/men/t-shirt/"title"/"color-01".jpeg
      params.Key = `${categoryUrl}/${imageFiles[fileIndex].originalname}`;
      params.Body = imageFiles[fileIndex].buffer;

      // put the url to imagesUrl
      if (count === 1) {
        imagesUrl[elem.color].main =
          awsUrl + `/${imageFiles[fileIndex].originalname}`;
      } else {
        imagesUrl[elem.color].sub.push(
          awsUrl + `/${imageFiles[fileIndex].originalname}`
        );
      }
      // upload to S3
      try {
        await s3Client.send(new PutObjectCommand(params));
        console.log(
          `> > > uploaded image: ${imageFiles[fileIndex].originalname}`
        );
      } catch (err) {
        console.log(err);
      }
      count++;
      fileIndex++;
    }
  }
  return imagesUrl;
}

/**
   * 
    
   */

/*if (!image) {
      return next(res.status(422).send({ message: "Missing image file!" }));
    }

    // let imageUrl = image.path.toString();
    // console.log(imageUrl);
    // const item = Items.build({ ...body });
    // await item.save();

    // console.log(item);

    // res.status(201).send(item);

    

 

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

      // the complete URL = "https//" + "params.Bucket" + ".s3.us-east-2.amazonaws.com/" + "params.Key"
    );

    // console.log(results);
 */
