import mongoose from "mongoose";

import { ReviewAttrs, ReviewDoc, ReviewModel } from "./review-interfaces";

const reviewSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  reviews: {
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
  },
});

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("review", reviewSchema);

export { Review };
