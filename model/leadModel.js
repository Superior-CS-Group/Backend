import Mongoose from "mongoose";

const LeadSchema = new Mongoose.Schema(
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

const LeadModel = Mongoose.model("Lead", LeadSchema);
export default LeadModel;
