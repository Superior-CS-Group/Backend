import Mongoose from "mongoose";

const ServicesSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    hours: {
      type: parseFloat,
      default: 0,
    },
    days: {
      type: parseFloat,
      default: 0,
    },
    rate: {
      type: parseFloat,
      default: 0,
    },
    unit: {
      type: String,
      default: "",
    },
    variation: {
      type: [
        {
          title: { type: String, required: true },
          price: { type: String, required: true },
          unit: { type: Boolean, default: true },
          image: { type: Array, required: false },
        },
      ],
      required: false,
    },
    type: {
      type: String,
      default: "services",
    },
    image: {
      type: Array,
      required: false,
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

const ServiceseModel = Mongoose.model("Services", ServicesSchema);
export default ServiceseModel;
