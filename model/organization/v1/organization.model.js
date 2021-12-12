import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    teamPhoto: {
      type: String,
      default: "",
    },
    estimationCoverPhoto: {
      type: String,
      default: "",
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
    termAndCondition: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const OrganizationModel = mongoose.model("Organization", OrganizationSchema);
export default OrganizationModel;
