import Mongoose from "mongoose";

const EstimationSchema = new Mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    contactNo: {
      type: String,
      default: "",
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
    leadSource: {
      type: String,
      default: "Website",
    },
    leadPerson: {
      type: [Mongoose.Types.ObjectId],
      ref: "User",
    },
    customerLeadId: {
      type: [Mongoose.Types.ObjectId],
      ref: "Customer",
    },
    estimaitonDate: {
      type: String,
      default: "",
    },
    estimaitonSentDate: {
      type: String,
      default: "",
    },
    estimaitonStatus: {
      type: String,
      default: "Process",
    },

    leadInvoinceNo: {
      type: Number,
      default: 1000001,
    },
  },
  {
    timestamps: true,
  }
);

const EstimationModel = Mongoose.model("Estimaiton", EstimationSchema);
export default EstimationModel;
