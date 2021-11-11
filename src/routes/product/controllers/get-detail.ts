import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Review } from "../../../models/review/review-schema";

export const getDetail = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    console.log("productId", productId);

    if (productId === "999") {
      return res.status(200).send({ product: null }); //csrfToken: req.csrfToken()
    }

    if (productId.length !== 24) {
      return next(new Bad_Request_Error("Invalid product Id", "productId"));
    }

    const selectOption = [p_keys.productInfo, p_keys.colorPropsList];
    const [product, reviews] = await Promise.all([
      Product.findById(productId).select(selectOption).lean(),
      // get the first 6 reviews initially, and use pagination if user wants to read more reviews
      Review.findOne({ productId }, { allReviews: { $slice: 6 } })
        .select([
          "_id",
          "productId",
          // "allReviews", after using "{ allReviews: { $slice: 6 } }", I don't need to
          // specifically select the "allReviews"
          "allRatings",
          "averageRating",
          "total",
        ])
        .lean(),
    ]);

    console.log("reviews", reviews);

    if (!product) {
      return next(new Bad_Request_Error("No product found", "get_detail"));
    }

    return res.status(200).send({ product, reviews });
  }
);
