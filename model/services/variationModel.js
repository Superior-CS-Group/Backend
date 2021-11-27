import Mongoose from "mongoose";

const VariationSchema = new Mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    image: { type: Array, required: false },
    catelogId: {
      type: Mongoose.Types.ObjectId, // making catelogId as ObjectId not a array because one variation is always belong to only one cateloag
      ref: "services",
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const VariationModel = Mongoose.model("variation", VariationSchema);
export default VariationModel;
