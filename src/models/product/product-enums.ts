export enum mainCategory {
  men = "men",
  women = "women",
  kids = "kids",
}
export const mainCatArray = Object.values(mainCategory);

export enum sizesCategory {
  small = "small",
  medium = "medium",
  large = "large",
}
export const sizesArray = Object.values(sizesCategory);

export enum p_keys {
  productInfo = "productInfo",
  colorPropsList = "colorPropsList",
  stock = "stock",
  searchTags = "searchTags",
  title = "productInfo.title",
  main_cat = "productInfo.main_cat",
  sub_cat = "productInfo.sub_cat",
  price = "productInfo.price",
  description = "productInfo.description",
  colorName = "colorPropsList.colorName",
  colorCode = "colorPropsList.colorCode",
  sizes = "colorPropsList.sizes",
  imageFiles = "colorPropsList.imageFiles",
}

// used in the search route, to see if the keywords match the category

export const main_cat = {
  men: "men",
  man: "men",
  male: "men",
  women: "women",
  woman: "women",
  female: "women",
  kids: "kids",
  kid: "kids",
  child: "kids",
  children: "kids",
};
export const sub_cat = {
  // men
  "t-shirts": "t-shirts",
  "t-shirt": "t-shirts",
  tshirt: "t-shirts",
  shirts: "shirts",
  shirt: "shirts",
  coat: "coats",
  coats: "coats",
  blazers: "blazers",
  blazer: "blazers",
  short: "shorts",
  shorts: "shorts",
  pant: "pants",
  pants: "pants",
  jean: "jeans",
  jeans: "jeans",
  shoe: "shoes",
  shoes: "shoes",
  hat: "hats",
  hats: "hats",
  "sun-glasses": "glasses",
  glasses: "glasses",
  // women

  // kids
};
export const colors_map = {
  white: "White",
  silver: "Silver",
  gray: "Gray",
  black: "Black",
  red: "Red",
  orange: "Orange",
  brown: "Brown",
  maroon: "Maroon",
  yellow: "Yellow",
  olive: "Olive",
  lime: "Lime",
  green: "Green",
  aqua: "Aqua",
  teal: "Teal",
  blue: "Blue",
  navy: "Navy",
  pink: "Pink",
  fuchsia: "Fuchsia",
  purple: "Purple",
};
