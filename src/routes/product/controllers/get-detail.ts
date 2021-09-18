import { Request, Response } from "express";

import {
  MenProduct,
  WomenProduct,
  KidsProduct,
} from "../../../models/product-schema";
import asyncWrapper from "../../../middlewares/async-wrapper";
import { MainCategory, p_keys } from "../../../models/product-enums";

export const getDetail = asyncWrapper(async (req: Request, res: Response) => {
  const { productId, category } = req.params;

  if (productId === "999") {
    return res.status(200).send({ product: undefined }); //csrfToken: req.csrfToken()
  }

  const selectOption = [p_keys.productInfo, p_keys.colorPropsList];
  let product;
  switch (category.toLowerCase()) {
    case MainCategory.men: {
      product = await MenProduct.findById(productId)
        .select(selectOption)
        .lean();
      break;
    }
    case MainCategory.women: {
      product = await WomenProduct.findById(productId)
        .select(selectOption)
        .lean();
      break;
    }
    case MainCategory.kids: {
      product = await KidsProduct.findById(productId)
        .select(selectOption)
        .lean();
    }
    default: {
      break;
    }
  }

  // console.log("find by Id --------->", product);
  return res.status(200).send({ product }); //csrfToken: req.csrfToken()
});
