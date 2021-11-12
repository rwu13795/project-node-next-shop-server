import { NextFunction, Request, Response } from "express";

import { Review } from "../../../models/review/review-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  ReviewDoc,
  ReviewProps,
} from "../../../models/review/review-interfaces";

interface Body {
  reviewProps: ReviewProps;
  productId: string;
}

export const addReview = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewProps, productId } = req.body as Body;

    reviewProps.date = new Date();

    // the MongoDB update will lock the document to prevent race condition
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
      { productId },
      update,
      { new: true }
    );

    if (!reviews) {
      return next(new Bad_Request_Error("No product found !"));
    }

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

    return res.status(201).send({ message: "OK" });
  }
);
