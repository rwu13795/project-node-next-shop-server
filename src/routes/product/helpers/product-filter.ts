import { p_keys } from "../../../models/product/product-enums";

export default function productFilter(colors?: string[], sizes?: string[]) {
  let db_filter;
  if (colors.length > 0 && sizes.length > 0) {
    db_filter = colors
      .map((color) => {
        return sizes.map((size) => {
          return {
            $and: [
              { [p_keys.colorName]: { $eq: color } },
              { [`stock.byColor.${color}.${size}`]: { $gt: 0 } },
            ],
          };
        });
      })
      .flat();

    return db_filter;
  }

  if (colors.length > 0 && sizes.length <= 0) {
    db_filter = colors.map((color) => {
      return { [`stock.byColor.${color}.total`]: { $gt: 0 } };
    });

    return db_filter;
  }

  if (colors.length <= 0 && sizes.length > 0) {
    db_filter = sizes.map((size) => {
      return { [`stock.bySize.${size}.total`]: { $gt: 0 } };
    });

    return db_filter;
  }

  return [{}];
}
