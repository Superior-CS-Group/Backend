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
    estimateSettings: {
      type: {
        builtInDesignCost: {
          type: Number,
        },
        fluffNumberDiscount: {
          type: Number,
        },
      },
      default: {
        builtInDesignCost: 0,
        fluffNumberDiscount: 0,
      },
    },
    paymentTerms: {
      type: [
        {
          title: {
            type: String,
          },
          value: {
            type: Number,
          },
          editable: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [
        {
          title: "Deposit payment at signing of contract",
          value: 12,
        },
        {
          title: "Progress payment when project is started",
          value: 88,
        },
      ],
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
