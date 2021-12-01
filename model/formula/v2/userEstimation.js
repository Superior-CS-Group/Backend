import mongoose from "mongoose";

const UserEstimationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerLead",
      required: true,
    },
    services: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "pending",
    },
    estimationNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserEstimationModel = mongoose.model(
  "UserEstimation",
  UserEstimationSchema
);

export default UserEstimationModel;
