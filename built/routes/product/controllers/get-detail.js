"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDetail = void 0;
/* send (1) product id
        (2) all image Url for each color
        (3) colors array, sizes array
        (4) price, stock, description
*/
const getProductDetail = async (req, res) => {
    res.status(200).send({ message: "OK" });
};
exports.getProductDetail = getProductDetail;
//# sourceMappingURL=get-detail.js.map