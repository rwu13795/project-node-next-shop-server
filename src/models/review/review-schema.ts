import mongoose from "mongoose";

import { ReviewAttrs, ReviewDoc, ReviewModel } from "./review-interfaces";

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, ref: "product" },
  averageRating: { type: Number, required: true },
  allRatings: {
    one: { type: Number, required: true },
    two: { type: Number, required: true },
    three: { type: Number, required: true },
    four: { type: Number, required: true },
    five: { type: Number, required: true },
  },
  reviews: [
    {
      title: { type: String },
      review: { type: String },
      rating: { type: String },
      date: { type: Date },
      user_name: { type: String },
      user_email: { type: String },
      size: { type: String },
    },
  ],
  total: { type: Number, required: true },
});

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("review", reviewSchema);

export { Review };
