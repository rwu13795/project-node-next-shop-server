"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello world");
const dotenv_1 = require("dotenv");
// import Stripe from "stripe";
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
if (process.env.NODE_ENV !== "production") {
    (0, dotenv_1.config)();
}
// // initialize Stripe
// export const stripe = new Stripe(process.env.STRIPE_SECRET, {
//   apiVersion: "2020-08-27",
// });
// console.log(process.env.STRIPE_SECRET);
// connect to MongoDB
const start = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            autoCreate: true,
            autoIndex: true,
        });
        console.log("> > > > >  Connected to MongoDB  < < < < <");
    }
    catch (err) {
        console.log(err);
    }
};
const port = process.env.PORT || 5000;
app_1.app.listen(port, () => {
    console.log(`> > > > >  Listening on port ${port}  < < < < <`);
});
start();
//# sourceMappingURL=index.js.map