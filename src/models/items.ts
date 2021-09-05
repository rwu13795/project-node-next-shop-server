import mongoose from "mongoose";

interface ItemsAttrs {
  title: string;
  price: number;
  //   userId: string;
}

interface ItemsDoc extends mongoose.Document {
  title: string;
  price: number;
  //   userId: string;
  version: number;
  orderId?: string;
}

interface ItemsModel extends mongoose.Model<ItemsDoc> {
  build(attrs: ItemsAttrs): ItemsDoc;
}

const itemsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // userId: {
    //   type: String,
    //   required: true,
    // },
    orderId: {
      type: String, // default - required: false,
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
itemsSchema.set("versionKey", "version");

itemsSchema.statics.build = (attrs: ItemsAttrs) => {
  return new Items(attrs);
};

const Items = mongoose.model<ItemsDoc, ItemsModel>("Items", itemsSchema);

export { Items };
