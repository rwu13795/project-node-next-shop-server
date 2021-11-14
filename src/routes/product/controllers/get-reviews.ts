import { NextFunction, Request, Response } from "express";

import { Review } from "../../../models/review/review-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  ReviewDoc,
  ReviewProps,
} from "../../../models/review/review-interfaces";
import { isValidObjectId } from "mongoose";

interface Body {
  pageNum: number;
  filter?: string;
  refresh?: boolean;
  productId?: string;
}

export const getReviews = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pageNum, filter, refresh, productId } = req.body as Body;

    const REVIEWS_PER_PAGE = 6;
    const skipNum = (pageNum - 1) * REVIEWS_PER_PAGE;
    const returnNum = REVIEWS_PER_PAGE;

    if (filter !== "") {
      // since the reviewsByRating is inside the same document as the allReviews
      // I don't know how to extract the filtered reviews in just on query
      // I have to add the duplicated review inside the "reviewsByRating" and
      // retrieve them directly
      let reviewDoc: ReviewDoc = await Review.findOne(
        { productId },
        // $slice: [ <number to skip>, <number to return> ]
        {
          [`reviewsByRating.${filter}`]: { $slice: [skipNum, returnNum] },
        }
      ).lean();

      if (!reviewDoc) return next(new Bad_Request_Error("No review found !"));

      let newPage = pageNum;
      if (pageNum > 1 && reviewDoc.reviewsByRating[`${filter}`] <= 0) {
        newPage = pageNum - 1;
        reviewDoc = await Review.findOne(
          { productId },
          {
            [`reviewsByRating.${filter}`]: {
              $slice: [(pageNum - 2) * REVIEWS_PER_PAGE, returnNum],
            },
          }
        );
      }

      return res.status(200).send({
        reviewDoc: {
          allReviews: reviewDoc.reviewsByRating[`${filter}`],
          _id: reviewDoc._id,
          productId: reviewDoc.productId,
          allRatings: reviewDoc.allRatings,
          averageRating: reviewDoc.averageRating,
          total: reviewDoc.total,
        },
        newPage,
      });

      // return res.status(200).send({
      //   reviews: reviewDoc.reviewsByRating[`${filter}`],
      // });
    }

    // if (refresh) {
    let reviewDoc: ReviewDoc = await Review.findOne(
      { productId },
      { allReviews: { $slice: [skipNum, returnNum] } }
    )
      .select(["_id", "productId", "allRatings", "averageRating", "total"])
      .lean();

    if (!reviewDoc) return next(new Bad_Request_Error("No review found !"));

    let newPage = pageNum;
    // if the current page is empty after deleting, fetch the page in front
    if (pageNum > 1 && reviewDoc.allReviews.length <= 0) {
      newPage = pageNum - 1;
      reviewDoc = await Review.findOne(
        { productId },
        {
          allReviews: { $slice: [(pageNum - 2) * REVIEWS_PER_PAGE, returnNum] },
        }
      )
        .select(["_id", "productId", "allRatings", "averageRating", "total"])
        .lean();
    }

    return res.status(200).send({ reviewDoc, newPage });
    // }

    // const reviewDoc: ReviewDoc = await Review.findById(productId, {
    //   allReviews: { $slice: [skipNum, returnNum] },
    // }).lean();
    // if (!reviewDoc) return next(new Bad_Request_Error("No review found !"));

    // return res.status(200).send({ reviews: reviewDoc.allReviews });
  }
);
