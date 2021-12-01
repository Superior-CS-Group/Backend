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
      ref: "CustomerLead",
    },
    autoFollowUp: {
      type: Boolean,
      default: true,
    },
    estimaitonSent: {
      type: Boolean,
      default: false,
    },
    estimaitonStatus: {
      type: String,
      default: "Lead Added",
    },
    estimaitonSentDate: {
      type: String,
      default: "",
    },
    daysItTookToSendEstimate: {
      type: Number,
      default: 0,
    },
    design: {
      type: Boolean,
      default: false,
    },
    designPaid: {
      type: Boolean,
      default: false,
    },
    noOfPhoneFollowUp: {
      type: String,
      default: "",
    },
    lastDatePhoneFollowUp: {
      type: String,
      default: "",
    },
    noOfEmailFollowUp: {
      type: String,
      default: "",
    },
    lastDateEmailFollowUp: {
      type: String,
      default: "",
    },
    estimaitonCloseDate: {
      type: String,
      default: "",
    },
    estimaitonScheduleDate: {
      type: String,
      default: "",
    },
    distance: {
      type: Number,
      default: 0,
    },
    leadInvoinceNo: {
      type: String,
      default: "E1000001",
    },
  },
  {
    timestamps: true,
  }
);

const EstimationModel = Mongoose.model("Estimaiton", EstimationSchema);
export default EstimationModel;
