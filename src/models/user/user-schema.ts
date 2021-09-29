import mongoose from "mongoose";

import { Password } from "../../utils/hash-password";
import { UserAttrs, UserDoc, UserModel } from "./user-interfaces";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  shippingAddress: [
    {
      address_1: { type: String, required: true },
      address_2: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip_code: { type: String, required: true },
    },
  ],
  resetToken: String,
  resetTokenExpiration: Date,
  orders: Array,
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// NOTE //
// don't hash the password in the SignUp route, when the "newUser" is save();
// this pre-save hook will tigger, and hash the password before saving it to the DB

// mongoose build-in middleware function
// a pre-save hook that is executed when a document is saved
userSchema.pre("save", async function (done) {
  // re-hash the password only if it is changed or newly created
  // "this" inside of a pre-save hook is the document that is about to be saved
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  // have to invoke done() manually whne the async function is done in pre-save hook
  done();
});

// assign the interface UserDoc and UserModel as the generic types
const User = mongoose.model<UserDoc, UserModel>("user", userSchema);

export { User };
