import { NextFunction, Request, Response } from "express";

import { MenProduct } from "../../../models/product/product-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { MainCategory, p_keys } from "../../../models/product/product-enums";

export const getDetail = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, category } = req.params;

    if (productId === "999") {
      return res.status(200).send({ product: null }); //csrfToken: req.csrfToken()
    }

    if (productId.length !== 24) {
      return next(new Bad_Request_Error("Invalid product Id", "productId"));
    }

    const selectOption = [p_keys.productInfo, p_keys.colorPropsList];
    const product = await MenProduct.findById(productId)
      .select(selectOption)
      .lean();

    if (!product) {
      return next(new Bad_Request_Error("No product found", "get_detail"));
    }

    return res.status(200).send({ product });
  }
);
