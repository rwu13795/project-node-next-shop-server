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
const multer_1 = __importDefault(require("multer"));
const routes_1 = require("./routes");
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
const fileFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
app.use((0, multer_1.default)({ fileFilter: fileFilter }).single("image"));
// connect all routers to the app
app.use("/api", routes_1.itemsRouter);
app.use("/api/admin", routes_1.adminRouter);
//# sourceMappingURL=app.js.map