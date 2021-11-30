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
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: function () {
      return this.type === "catalog" || this.type === "service";
    },
  },
  unit: {
    type: String, //mongoose.Schema.Types.ObjectId
    required: function () {
      return this.type === "catalog";
    },
  },
  variations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Variation",
    default: [],
  },
  hours: {
    type: Number,
    required: function () {
      return this.type === "service";
    },
  },
  day: {
    type: Number,
    required: function () {
      return this.type === "service";
    },
  },
});

const CatalogModel = mongoose.model("CatalogV2", catalogSchema);
export default CatalogModel;
