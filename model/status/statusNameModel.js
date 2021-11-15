import Mongoose from "mongoose";

const StatusNameSchema = new Mongoose.Schema(
  {
    
    name: {
      type: String,
      default: "",
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

const StatusNameModel = Mongoose.model("StatusName", StatusNameSchema);
export default StatusNameModel;
