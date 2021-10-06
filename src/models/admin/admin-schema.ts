import mongoose from "mongoose";

import { Password } from "../../utils/hash-password";
import { AdminAttrs, AdminDoc, AdminModel } from "./admin-interfaces";

const adminSchema = new mongoose.Schema({
  admin_id: { type: String, required: true },
  password: { type: String, required: true },
  added_productIds: { type: Array, required: true },
});

adminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

adminSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

const Admin = mongoose.model<AdminDoc, AdminModel>("admin", adminSchema);
adminSchema;

export { Admin };
