import Mongoose from "mongoose";

const TabFilterSchema = new Mongoose.Schema(
  {
    userId: {
      type: Mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },

    filterObject: {
      type: Object,
      required: false,
    },
    columnOrder: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);

const TabFilterModel = Mongoose.model("TabFilter", TabFilterSchema);
export default TabFilterModel;
