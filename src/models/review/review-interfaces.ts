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
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface ReviewAttrs {
  productId: string;
  averageRating: number;
  allRatings: AllRatings;
  allReviews: ReviewProps[] | string[];
  total: number;
}

export interface ReviewDoc extends mongoose.Document {
  productId: string;
  averageRating: number;
  allRatings: AllRatings;
  allReviews: ReviewProps[];
  reviewsByRating: {
    five?: ReviewProps[];
    four?: ReviewProps[];
    three?: ReviewProps[];
    two?: ReviewProps[];
    one?: ReviewProps[];
  };
  total: number;
}

export interface ReviewModel extends mongoose.Model<any> {
  build(attrs: ReviewAttrs): ReviewDoc;
}
