import mongoose from "mongoose";

interface SizeProps {
  [color: string]: { small?: number; medium?: number; large?: number };
}

interface StockAttrs {
  p_id: string;
  color: SizeProps;
}

interface StockDoc extends mongoose.Document {
  p_id: string;
  color: SizeProps;
  version: number;
}

interface StockModel extends mongoose.Model<StockDoc> {
  build(attrs: StockAttrs): StockDoc;
}

const stockSchema = new mongoose.Schema(
  {
    p_id: {
      type: String,
      required: true,
    },
    color: {
      type: Object,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// change the default "__v" version property to "version"
stockSchema.set("versionKey", "version");

stockSchema.statics.build = (attrs: StockAttrs) => {
  return new Stock(attrs);
};

const Stock = mongoose.model<StockDoc, StockModel>("Stock", stockSchema);

export { Stock };
