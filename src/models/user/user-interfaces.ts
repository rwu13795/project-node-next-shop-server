import mongoose from "mongoose";

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  orders?: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  admin?: boolean;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  orders?: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  resetToken?: string;
  resetTokenExpiration?: Date;
  admin?: boolean;
}

export interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): UserDoc;
}
