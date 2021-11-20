import mongoose from "mongoose";

import {
  FilterStats_Attrs,
  FilterStats_Doc,
  FilterStats_Model,
} from "./filter-stats-interfaces";

const filterStats_Schema = new mongoose.Schema({
  main_cat: { type: String, required: true },
  sub_cat: { type: String, required: true },
  sizes: { type: Object, required: true },
  colors: { type: Object, required: true },
});

filterStats_Schema.statics.build = (attrs: FilterStats_Attrs) => {
  return new FilterStats(attrs);
};

const FilterStats = mongoose.model<FilterStats_Doc, FilterStats_Model>(
  "filter_stats",
  filterStats_Schema
);

export { FilterStats };
