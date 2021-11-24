import contentSecurityPolicy from "helmet/dist/middlewares/content-security-policy";
import {
  FilterColors,
  FilterSizes,
  FilterStats_Doc,
  FilterStats_Attrs,
} from "../../../models/filter-stats/filter-stats-interfaces";
import { FilterStats } from "../../../models/filter-stats/filter-stats-schema";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

const initialSizes: FilterSizes = {};
const initialColors: FilterColors = {};

export async function updateFilterStats(
  main_cat: string,
  sub_cat: string
): Promise<void> {
  let main = main_cat.toLowerCase();
  let sub = sub_cat.toLowerCase();

  let filterStats: FilterStats_Doc = await FilterStats.findOne({
    main_cat: main,
    sub_cat: sub,
  });

  const sizes = initialSizes;
  const colors = initialColors;

  if (!filterStats) {
    filterStats = FilterStats.build({
      main_cat: main,
      sub_cat: sub,
      sizes,
      colors,
      matchingTotal: 0,
    });
    await filterStats.save();
    await updateAvailability(main, sub);
  } else {
    await updateAvailability(main, sub);
  }
}

// update the initial filter stats only when the there is change in the product
// so that the client won't need to count the Availability repeatly
// whenever the sub-cat page is loaded
async function updateAvailability(
  main_cat: string,
  sub_cat: string
): Promise<void> {
  // need to use the spread operator to copy an the values of an object
  // without using the spread operator, it only assigns the address of the object
  // and it will alter the values of "initialSizes" and "initialColors"
  // whenever I make changes in "sizes" and "colors"
  let sizes = { ...initialSizes };
  let colors = { ...initialColors };

  const products = await Product.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
  })
    .select(["colorPropsList"])
    .lean();

  for (let product of products) {
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
  const matchingTotal = products.length;

  await FilterStats.findOneAndUpdate(
    { main_cat, sub_cat },
    { sizes, colors, matchingTotal }
  );
}
