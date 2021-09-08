"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
/* send (1) product id
        (2) preview image Url for each color
        (3) an array contains all colors
*/
const getProducts = async (req, res) => {
    const param = req.params;
    console.log(param);
    res.status(200).send({ message: "OK" });
};
exports.getProducts = getProducts;
//# sourceMappingURL=get-products.js.map