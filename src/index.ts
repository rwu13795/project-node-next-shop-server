console.log("hello world");
import { config } from "dotenv";
// import Stripe from "stripe";
// import mongoose from "mongoose";

import { app } from "./app";

if (process.env.NODE_ENV !== "production") {
  config();
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
app.listen(port, () => {
  console.log(`> > > > >  Listening on port ${port}  < < < < <`);
});

// start();
