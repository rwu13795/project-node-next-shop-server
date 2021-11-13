import { NextFunction, Request, Response } from "express";

import { Review } from "../../../models/review/review-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  ReviewDoc,
  ReviewProps,
} from "../../../models/review/review-interfaces";
import { isValidObjectId } from "mongoose";

interface Body {
  reviewPrimaryId: string;
  pageNum: number;
  filter?: string;
  refresh?: boolean;
  productId?: string;
}

export const getReviews = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewPrimaryId, pageNum, filter, refresh, productId } =
      req.body as Body;

    const REVIEWS_PER_PAGE = 6;
    const skipNum = (pageNum - 1) * REVIEWS_PER_PAGE;
    const returnNum = REVIEWS_PER_PAGE;

    if (filter !== "") {
      // since the reviewsByRating is inside the same document as the allReviews
      // I don't know how to extract the filtered reviews in just on query
      // I have to add the duplicated review inside the "reviewsByRating" and
      // retrieve them directly
      const reviewDoc: ReviewDoc = await Review.findById(reviewPrimaryId, {
        [`reviewsByRating.${filter}`]: { $slice: [skipNum, returnNum] },
      }).lean();

      if (!reviewDoc) return next(new Bad_Request_Error("No review found !"));

      return res.status(200).send({
        reviews: reviewDoc.reviewsByRating[`${filter}`],
      });
    }

    if (refresh) {
      const reviewDoc: ReviewDoc = await Review.findOne(
        { productId },
        { allReviews: { $slice: 6 } }
      )
        .select(["_id", "productId", "allRatings", "averageRating", "total"])
        .lean();

      if (!reviewDoc) return next(new Bad_Request_Error("No review found !"));

      return res.status(200).send({ reviewDoc });
    }

    // $slice: [ <number to skip>, <number to return> ]
    const reviewDoc: ReviewDoc = await Review.findById(reviewPrimaryId, {
      allReviews: { $slice: [skipNum, returnNum] },
    }).lean();
    if (!reviewDoc) return next(new Bad_Request_Error("No review found !"));

    return res.status(200).send({ reviews: reviewDoc.allReviews });
  }
);
