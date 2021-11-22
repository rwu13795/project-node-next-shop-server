import {
  FilterColors,
  FilterSizes,
  FilterStats_Doc,
} from "../../../models/filter-stats/filter-stats-interfaces";
import { FilterStats } from "../../../models/filter-stats/filter-stats-schema";
import { p_keys } from "../../../models/product/product-enums";
import { Product } from "../../../models/product/product-schema";

const initialSizes: FilterSizes = { small: 0, medium: 0, large: 0 };
const initialColors: FilterColors = {
  White: 0,
  Silver: 0,
  Gray: 0,
  Black: 0,
  Red: 0,
  Orange: 0,
  Brown: 0,
  Maroon: 0,
  Yellow: 0,
  Olive: 0,
  Lime: 0,
  Green: 0,
  Aqua: 0,
  Teal: 0,
  Blue: 0,
  Navy: 0,
  Pink: 0,
  Fuchsia: 0,
  Purple: 0,
};

export default async function updateFilterStats(
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

  console.log(sizes);

  let products = await Product.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
  })
    .select(["colorPropsList"])
    .lean();

  for (let product of products) {
    for (let elem of product.colorPropsList) {
      for (let [key, value] of Object.entries(elem.sizes)) {
        if (value > 0) {
          sizes[key] += 1;
        }
      }
      colors[elem.colorName] += 1;
    }
  }

  await FilterStats.findOneAndUpdate({ main_cat, sub_cat }, { sizes, colors });
}
