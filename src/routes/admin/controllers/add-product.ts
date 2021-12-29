import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";

import { Product } from "../../../models/product/product-schema";
import {
  ColorProps,
  ProductAttrs,
} from "../../../models/product/product-interfaces";
import { sizesArray } from "../../../models/product/product-enums";
import mapStock from "../helpers/map-product-stock";
import uploadImageTo_S3 from "../helpers/upload-to-S3";
import { Not_Authorized_Error, UploadedImages } from "../../../middlewares";
import { Admin } from "../../../models/admin/admin-schema";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Review } from "../../../models/review/review-schema";
import { updateFilterStats } from "../helpers/update-filter-stats";
import updateCategoryNumber from "../helpers/update-cat-number";
// import { ReviewDoc } from "../../../models/review/review-interfaces";

export interface ColorPropsFromClient {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  imageFiles: string[];
  modifiedImages?: (string | File)[];
  modifiedIndex?: number[];
}
interface AddProductBody {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  colorPropsListFromClient: ColorPropsFromClient[];
  description: string;
}

if (process.env.NODE_ENV !== "production") {
  config();
}

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFiles: UploadedImages = req.files;
  const {
    title,
    main_cat,
    sub_cat,
    price,
    colorPropsListFromClient,
    description,
  }: AddProductBody = req.body;

  const adminUser: AdminDoc = await Admin.findOne({
    admin_username: req.session.adminUser.admin_username,
  });
  if (!adminUser) {
    return next(new Not_Authorized_Error());
  }

  const stock = mapStock(sizesArray, colorPropsListFromClient);

  const colorPropsList_toBeSaved: ColorProps[] = await uploadImageTo_S3(
    false,
    imageFiles,
    colorPropsListFromClient,
    main_cat.toLocaleLowerCase(),
    sub_cat.toLocaleLowerCase(),
    title
  );

  // put keywords in search tags
  // const tagsRegex = /[\s-]+/g; // match all "space" and "dash-line"
  const tagsRegex = /[\s]+/g; // only match all "space"
  let searchTags: string[] = title.toLowerCase().split(tagsRegex);
  for (let elem of colorPropsListFromClient) {
    searchTags.push(elem.colorName.toLowerCase());
    // push the same repeated used images link to the product's imageFiles
    elem.imageCount += 5;
    for (let i = 1; i <= 5; i++) {
      elem.imageFiles.push(
        `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_BUCKET_REGION}/other-images/more-images-${i}.jpg`
      );
    }
  }

  const productAttrs: ProductAttrs = {
    productInfo: {
      title,
      main_cat: main_cat.toLocaleLowerCase(),
      sub_cat: sub_cat.toLocaleLowerCase(),
      price,
      description,
    },
    colorPropsList: colorPropsList_toBeSaved,
    stock,
    searchTags,
    createdDate: new Date(),
    admin_id: adminUser._id,
    admin_username: adminUser.admin_username,
  };

  const product = Product.build(productAttrs);
  const review = Review.build({
    productId: product._id,
    averageRating: 0,
    allRatings: { one: 0, two: 0, three: 0, four: 0, five: 0 },
    allReviews: [],
    total: 0,
  });

  adminUser.product_ids.unshift(product._id);
  product.reviewId = review._id;

  await Promise.all([product.save(), review.save()]);

  await Promise.all([
    updateFilterStats(main_cat, sub_cat),
    updateCategoryNumber(adminUser),
  ]);

  /* ****************************************** */
  /* add testing reviews after adding new items */
  /* ****************************************** */
  /*
  const sizes = ["Small", "Medium", "Large"];
  const body_length_reduction = [0, 200, 400, 600];
  const rating = ["one", "two", "three", "four", "five"];

  let reviews_num = 5 + getRandomInt(20);

  for (let i = 1; i <= reviews_num; i++) {
    let random_rating = rating[getRandomInt(5)];
    let random_size = sizes[getRandomInt(3)];
    let sliceNum = body_length_reduction[getRandomInt(4)] - getRandomInt(20);
    let review = `review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i} review ${i}`;
    let random_review = review.slice(0, review.length - sliceNum);
    let reviewProps: ReviewProps = {
      title: `testing review ${i}`,
      review: random_review,
      rating: random_rating,
      date: new Date(),
      user_name: `user ${i}`,
      user_email: `user${i}@test.com`,
      size: random_size,
    };

    let update = {
      $inc: {
        total: 1,
        [`allRatings.${reviewProps.rating}`]: 1,
      },
      $push: {
        allReviews: { $each: [reviewProps], $position: 0 },
        [`reviewsByRating.${reviewProps.rating}`]: {
          $each: [reviewProps],
          $position: 0,
        },
      },
    };

    const reviews: ReviewDoc = await Review.findOneAndUpdate(
      { productId: product._id },
      update,
      { new: true }
    );

    // after update the reviews, update the average
    let sum = 0;
    let multiplier = 5;
    for (let rating of Object.values(reviews.allRatings)) {
      sum = sum + rating * multiplier;
      multiplier--;
    }
    const average = Math.round((sum / reviews.total) * 10) / 10;
    reviews.averageRating = average;

    // add the allReviews id to the new filtered review
    reviews.reviewsByRating[reviewProps.rating][0].id_allReviews =
      reviews.allReviews[0]._id;

    await reviews.save();
  }
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  res.status(201).send({ main_cat, sub_cat });
};

// interface ReviewProps {
//   title: string;
//   review: string;
//   rating: string;
//   date: Date;
//   user_name: string;
//   user_email: string;
//   size: string;
// }

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }
