import {
  FilterColors,
  FilterSizes,
  FilterStats_Attrs,
} from "../../../models/filter-stats/filter-stats-interfaces";
import { ProductDoc } from "../../../models/product/product-interfaces";

export default function getCurrentFilterStats(
  main_cat: string,
  sub_cat: string,
  filtered_products: ProductDoc[],
  filtered_sizes: string[],
  filtered_colors: string[],
  filterStats: FilterStats_Attrs
): FilterStats_Attrs {
  let sizes: FilterSizes = {};
  let colors: FilterColors = {};

  if (filtered_sizes.length > 0 && filtered_colors.length > 0) {
    for (let product of filtered_products) {
      for (let elem of product.colorPropsList) {
        for (let [key, value] of Object.entries(elem.sizes)) {
          if (value > 0) {
            sizes[key] ? (sizes[key] += 1) : (sizes[key] = 1);
          }
        }
        colors[elem.colorName]
          ? (colors[elem.colorName] += 1)
          : (colors[elem.colorName] = 1);
      }
    }
  }

  // if there is only sizes filter, just count the current colors
  if (filtered_sizes.length > 0 && filtered_colors.length <= 0) {
    sizes = { ...filterStats.sizes };

    for (let product of filtered_products) {
      for (let elem of product.colorPropsList) {
        for (let size of filtered_sizes) {
          if (elem.sizes[size] > 0) {
            colors[elem.colorName]
              ? (colors[elem.colorName] += 1)
              : (colors[elem.colorName] = 1);
          }
        }
      }
    }
  }

  // if there is only colors filter, just count the current sizes
  if (filtered_sizes.length <= 0 && filtered_colors.length > 0) {
    colors = { ...filterStats.colors };

    for (let product of filtered_products) {
      for (let elem of product.colorPropsList) {
        for (let color of filtered_colors) {
          if (color === elem.colorName) {
            for (let [key, value] of Object.entries(elem.sizes)) {
              if (value > 0) {
                sizes[key] ? (sizes[key] += 1) : (sizes[key] = 1);
              }
            }
          }
        }
      }
    }
  }

  const matchingTotal = filtered_products.length;

  return { main_cat, sub_cat, sizes, colors, matchingTotal };
}
