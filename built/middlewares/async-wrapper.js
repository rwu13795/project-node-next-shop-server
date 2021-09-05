"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper = (callback) => {
    return async (req, res, next) => {
        try {
            // invoke the function that was passed to the wrapper
            await callback(req, res, next);
        }
        catch (error) {
            // there is a custom error handler component
            next(error);
        }
    };
};
exports.default = asyncWrapper;
//# sourceMappingURL=async-wrapper.js.map