import Mongoose from "mongoose";

const VariationSchema = new Mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: false },
    unit: { type: Number, required: false },
    image: { type: Array, required: false },
    catelogId: {
      type: [Mongoose.Types.ObjectId],
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

const VariationeModel = Mongoose.model("variation", VariationSchema);
export default VariationeModel;
