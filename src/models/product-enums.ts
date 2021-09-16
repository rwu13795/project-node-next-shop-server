export enum MainCategory {
  men = "men",
  women = "women",
  kids = "kids",
}
export const mainCatArray = Object.values(MainCategory);

export enum WomenCategory {
  jeans = "jeans",
  shorts = "shorts",
  dresses = "dresses",
}
export const womenCatArray = Object.values(WomenCategory);

export enum MenCategory {
  Tshirts = "t-shirts",
  coats = "coats",
  shorts = "shorts",
}
export const menCatArray = Object.values(MenCategory);

export enum KidsCategory {
  Tshirts = "t-shirts",
  shorts = "shorts",
}
export const kidsCatArray = Object.values(KidsCategory);

export enum SizesCategory {
  small = "small",
  medium = "medium",
  large = "large",
}
export const sizesArray = Object.values(SizesCategory);

export enum DB_AttrKeys {
  title = "title",
  main_cat = "main_cat",
  sub_cat = "sub_cat",
  price = "price",
  colors = "colors",
  sizes = "sizes",
  stock = "stock",
  searchTags = "searchTags",
  imagesUrl = "imagesUrl",
  description = "description",
  version = "version",
}
