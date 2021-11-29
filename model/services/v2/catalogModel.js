import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  // description: {
  //   type: String,
  //   default: "",
  // },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: function () {
      return this.type === "catalog";
    },
  },
  unit: {
    type: String, //mongoose.Schema.Types.ObjectId
    required: function () {
      return this.type === "catalog";
    },
  },
  // quantity: {
  //   type: Number,
  //   required: function () {
  //     return this.type === "catalog";
  //   },
  // },
  variations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Variation",
    default: [],
  },
});

const CatalogModel = mongoose.model("CatalogV2", catalogSchema);
export default CatalogModel;
