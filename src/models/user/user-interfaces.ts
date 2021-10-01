import mongoose from "mongoose";
import { inputNames } from "../../utils/enums/input-names";

export interface UserInfo {
  [inputNames.first_name]: string;
  [inputNames.last_name]: string;
  [inputNames.address_1]: string;
  [inputNames.address_2]: string;
  [inputNames.city]: string;
  [inputNames.state]: string;
  [inputNames.zip_code]: string;
  [inputNames.phone]: string;
}

export interface UserAttrs {
  [inputNames.email]: string;
  [inputNames.password]: string;
  userInfo: UserInfo;
  orders?: string[];
}

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  userInfo: UserInfo;
  orders?: string[];
  resetToken?: string;
  resetTokenExpiration?: Date;
}

export interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): UserDoc;
}
