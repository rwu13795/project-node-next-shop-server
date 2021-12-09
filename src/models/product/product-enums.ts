export enum mainCategory {
  men = "men",
  women = "women",
  kids = "kids",
}
export const mainCatArray = Object.values(mainCategory);

export enum womenCategory {
  jeans = "jeans",
  shorts = "shorts",
  dresses = "dresses",
}
export const womenCatArray = Object.values(womenCategory);

export enum menCategory {
  Tshirts = "t-shirts",
  coats = "coats",
  shorts = "shorts",
}
export const menCatArray = Object.values(menCategory);

export enum kidsCategory {
  Tshirts = "t-shirts",
  shorts = "shorts",
}
export const kidsCatArray = Object.values(kidsCategory);

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
