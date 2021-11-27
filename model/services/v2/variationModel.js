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
    type: mongoose.Schema.Types.ObjectIc,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catalog",
  },
});

const VariationModel = mongoose.model("Variation", variationSchema);
export default VariationModel;
