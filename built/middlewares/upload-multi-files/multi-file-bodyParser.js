"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiFile_bodyParser = (req, res, next) => {
    // becuase we are using "FormData" to send both the image-files and JSON data,
    // we have to parse the "req.body.document" and put this "document" back inside
    // "req.body", so that the "bodyValidator" can access the correct "body"
    const document = JSON.parse(req.body.document);
    req.body = document;
    next();
};
exports.default = multiFile_bodyParser;
//# sourceMappingURL=multi-file-bodyParser.js.map