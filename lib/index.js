"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello world");
const dotenv_1 = require("dotenv");
// import Stripe from "stripe";
// import mongoose from "mongoose";
const app_1 = require("./app");
if (process.env.NODE_ENV !== "production") {
    (0, dotenv_1.config)();
}
// // initialize Stripe
// export const stripe = new Stripe(process.env.STRIPE_SECRET, {
//   apiVersion: "2020-08-27",
// });
// console.log(process.env.STRIPE_SECRET);
// const start = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       autoCreate: true,
//       autoIndex: true,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
const port = process.env.PORT || 3333;
app_1.app.listen(port, () => {
    console.log(`> > > > >  Listening on port ${port}  < < < < <`);
});
// start();
//# sourceMappingURL=index.js.map