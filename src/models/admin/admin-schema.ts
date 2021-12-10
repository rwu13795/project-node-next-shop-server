import mongoose from "mongoose";

import { Password } from "../../utils/hash-password";
import { AdminAttrs, AdminDoc, AdminModel } from "./admin-interfaces";

const adminSchema = new mongoose.Schema({
  admin_username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  product_ids: { type: Array, required: true },
  product_category: { type: Object },
  // product_category_master: { type: Object },
  master_admin: { type: Boolean },
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

export { Admin };
