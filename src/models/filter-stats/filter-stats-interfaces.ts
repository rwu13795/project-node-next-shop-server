import mongoose from "mongoose";

interface Sizes {
  small: number;
  medium: number;
  large: number;
  [size: string]: number;
}

interface Colors {
  White: number;
  Silver: number;
  Gray: number;
  Black: number;
  Red: number;
  Orange: number;
  Brown: number;
  Maroon: number;
  Yellow: number;
  Olive: number;
  Lime: number;
  Green: number;
  Aqua: number;
  Teal: number;
  Blue: number;
  Navy: number;
  Pink: number;
  Fuchsia: number;
  Purple: number;
  [color: string]: number;
}

export interface FilterStats_Attrs {
  main_cat: string;
  sub_cat: string;
  sizes: Sizes;
  colors: Colors;
}

export interface FilterStats_Doc extends mongoose.Document {
  main_cat: string;
  sub_cat: string;
  sizes: Sizes;
  colors: Colors;
}

export interface FilterStats_Model extends mongoose.Model<any> {
  build(attrs: FilterStats_Attrs): FilterStats_Doc;
}
