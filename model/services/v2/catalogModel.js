import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["catalog, subCatalog"],
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
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
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type === "catalog";
    },
  },
  quantity: {
    type: Number,
    required: function () {
      return this.type === "catalog";
    },
  },
  variations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Variation",
    default: [],
  },
});

const CatalogModel = mongoose.model("Catalog", catalogSchema);
export default CatalogModel;
