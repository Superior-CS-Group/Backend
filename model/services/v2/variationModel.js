import mongoose from "mongoose";

const variationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String, // mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // quantity: {
  //   type: Number,
  // required: true,
  // },
  image: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  catelogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catalog",
  },
});

const VariationModelV2 = mongoose.model("VariationV2", variationSchema);
export default VariationModelV2;
