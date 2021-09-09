"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const router_1 = require("./routes/admin/router");
const router_2 = require("./routes/product/router");
const error_handler_1 = require("./middlewares/error-handler/error-handler");
const app = (0, express_1.default)();
exports.app = app;
// app.use(express.json());
// Use JSON parser for all non-webhook routes
// parse all other routes to JSON, leave the /webhook route as rawBody
app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.use((0, cors_1.default)({
    origin: [
        "https://project-next-js-blog.vercel.app",
        "http://localhost:3000",
    ],
}));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// connect all routers to the app
app.use("/api/products", router_2.productRouter);
app.use("/api/admin", router_1.adminRouter);
// YOU HAVE TO APPLY THE errorHandler AT LAST //
app.use(error_handler_1.errorHandler);
//# sourceMappingURL=app.js.map