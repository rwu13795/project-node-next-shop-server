import { NextFunction, Request, Response } from "express";

import { Review } from "../../../models/review/review-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  ReviewDoc,
  ReviewProps,
} from "../../../models/review/review-interfaces";

interface Body {
  reviewId: string;
  pageNum: number;
  filter?: string;
}

export const getReviews = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId, pageNum, filter } = req.body as Body;

    const REVIEWS_PER_PAGE = 6;
    const skipNum = (pageNum - 1) * REVIEWS_PER_PAGE;
    const returnNum = REVIEWS_PER_PAGE;

    if (filter !== "") {
      const reviewDoc: ReviewDoc = await Review.findById(reviewId, {
        [`reviewsByRating.${filter}`]: { $slice: [skipNum, returnNum] },
      }).lean();

      return res.status(200).send({
        message: "OK",
        reviews: reviewDoc.reviewsByRating[`${filter}`],
      });
    }

    // $slice: [ <number to skip>, <number to return> ]
    const reviewDoc: ReviewDoc = await Review.findById(reviewId, {
      allReviews: { $slice: [skipNum, returnNum] },
    }).lean();

    return res
      .status(200)
      .send({ message: "OK", reviews: reviewDoc.allReviews });
  }
);
