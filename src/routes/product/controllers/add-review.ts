import { NextFunction, Request, Response } from "express";

import { Review } from "../../../models/review/review-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  ReviewDoc,
  ReviewProps,
} from "../../../models/review/review-interfaces";

export const addReview = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewProps: ReviewProps = req.body.reviewProps;
    const productId: string = req.body.productId;

    reviewProps.date = new Date();

    // the MongoDB update will lock the document to prevent race condition
    let update = {
      $inc: {
        total: 1,
        [`allRatings.${reviewProps.rating}`]: 1,
      },
      $push: { reviews: reviewProps },
    };

    const reviews: ReviewDoc = await Review.findOneAndUpdate(
      { productId },
      update,
      { new: true }
    );

    // after update the reviews, update the average
    let sum = 0;
    let multiplier = 1;
    for (let rating of Object.values(reviews.allRatings)) {
      sum = sum + rating * multiplier;
      multiplier++;
    }
    const average = Math.round((sum / reviews.total) * 10) / 10;
    reviews.averageRating = average;
    await reviews.save();

    console.log(reviews);

    return res.status(201).send({ message: "OK" });
  }
);
