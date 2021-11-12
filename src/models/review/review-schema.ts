import mongoose, { mongo } from "mongoose";

import { ReviewAttrs, ReviewDoc, ReviewModel } from "./review-interfaces";

const reviewProps = {
  title: { type: String },
  review: { type: String },
  rating: { type: String },
  date: { type: Date },
  user_name: { type: String },
  user_email: { type: String },
  size: { type: String },
  id_allReviews: { type: String },
};

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, ref: "product" },
  averageRating: { type: Number, required: true },
  allRatings: {
    five: { type: Number, required: true },
    four: { type: Number, required: true },
    three: { type: Number, required: true },
    two: { type: Number, required: true },
    one: { type: Number, required: true },
  },
  allReviews: [reviewProps],
  reviewsByRating: {
    five: [reviewProps],
    four: [reviewProps],
    three: [reviewProps],
    two: [reviewProps],
    one: [reviewProps],
  },
  total: { type: Number, required: true },
});

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("review", reviewSchema);

export { Review };
