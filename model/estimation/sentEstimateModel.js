import Mongoose from "mongoose";

const SentEstimationSchema = new Mongoose.Schema(
  {
    emailTemplateId: {
      type: String,
    },
    estimateId: {
      type: [Mongoose.Types.ObjectId],
      ref: "Estimaiton",
    },
    customerLeadId: {
      type: [Mongoose.Types.ObjectId],
      ref: "CustomerLead",
    }, 
    estimaitonScheduleDate: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "remider",
    },
  },
  {
    timestamps: true,
  }
);

const SentEstimationModel = Mongoose.model("SentEstimaiton", SentEstimationSchema);
export default SentEstimationModel;
