import { NextFunction, Request, Response } from "express";

import { Review } from "../../../models/review/review-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import {
  ReviewDoc,
  ReviewProps,
} from "../../../models/review/review-interfaces";

interface Body {
  id_allReviews: string;
  reviewPrimaryId: string;
  rating: string;
}

export const deleteReview = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id_allReviews, reviewPrimaryId, rating } = req.body as Body;

    const update = {
      $inc: {
        total: -1,
        [`allRatings.${rating}`]: -1,
      },
      $pull: {
        allReviews: { _id: id_allReviews },
        [`reviewsByRating.${rating}`]: { id_allReviews: id_allReviews },
      },
    };

    const updatedReviews: ReviewDoc = await Review.findByIdAndUpdate(
      reviewPrimaryId,
      update,
      { new: true }
    );

    let sum = 0;
    let multiplier = 5;
    for (let rating of Object.values(updatedReviews.allRatings)) {
      sum = sum + rating * multiplier;
      multiplier--;
    }
    const average = Math.round((sum / updatedReviews.total) * 10) / 10;
    updatedReviews.averageRating = average;

    await updatedReviews.save();

    return res.status(201).send({ message: "OK" });
  }
);
