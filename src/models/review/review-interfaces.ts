import mongoose from "mongoose";

interface ReviewProps {
  review: string;
  rating: number;
  user_name: string;
  user_email: string;
}

export interface ReviewAttrs {
  product_id: string;
  reviews: ReviewProps[];
}

export interface ReviewDoc extends mongoose.Document {
  product_id: string;
  reviews: ReviewProps[];
}

export interface ReviewModel extends mongoose.Model<any> {
  build(attrs: ReviewAttrs): ReviewDoc;
}
