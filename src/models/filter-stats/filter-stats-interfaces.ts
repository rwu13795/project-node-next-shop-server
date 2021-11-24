import mongoose from "mongoose";

export interface FilterSizes {
  small: number;
  medium: number;
  large: number;
  [size: string]: number;
}

export interface FilterColors {
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
  sizes: FilterSizes;
  colors: FilterColors;
  matchingTotal: number;
}

export interface FilterStats_Doc extends mongoose.Document {
  main_cat: string;
  sub_cat: string;
  sizes: FilterSizes;
  colors: FilterColors;
  matchingTotal: number;
}

export interface FilterStats_Model extends mongoose.Model<any> {
  build(attrs: FilterStats_Attrs): FilterStats_Doc;
}
