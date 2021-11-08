import mongoose from "mongoose";

export interface ReviewProps {
  title: string;
  review: string;
  rating: string;
  date: Date;
  user_name: string;
  user_email: string;
  size: string;
}

interface AllRatings {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
}

export interface ReviewAttrs {
  productId: string;
  averageRating: number;
  allRatings: AllRatings;
  reviews: ReviewProps[] | string[];
  total: number;
}

export interface ReviewDoc extends mongoose.Document {
  productId: string;
  averageRating: number;
  allRatings: AllRatings;
  reviews: ReviewProps[];
  total: number;
}

export interface ReviewModel extends mongoose.Model<any> {
  build(attrs: ReviewAttrs): ReviewDoc;
}
