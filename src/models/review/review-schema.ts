import mongoose from "mongoose";

import { ReviewAttrs, ReviewDoc, ReviewModel } from "./review-interfaces";

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, ref: "product" },
  reviews: [
    {
      review: { type: String },
      rating: { type: Number },
      user_name: { type: String },
      user_email: { type: String },
    },
  ],
});

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("review", reviewSchema);

export { Review };
