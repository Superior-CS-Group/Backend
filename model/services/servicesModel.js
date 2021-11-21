import Mongoose from "mongoose";

const ServicesSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    customId: {
      type: Number,
      default: Date.now() + Math.floor(Math.random() * 100000),
    },
    hours: {
      type: Number,
      required: function () {
        return this.type === "service";
      },
    },
    days: {
      type: Number,
      required: function () {
        return this.type === "service";
      },
    },
    rate: {
      type: Number,
      required: function () {
        return this.type === "service";
      },
    },
    unit: {
      type: Number,
      required: function () {
        return this.type == "service";
      },
    },
    type: {
      type: String,
      default: "service",
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

const ServiceseModel = Mongoose.model("services", ServicesSchema);
export default ServiceseModel;
