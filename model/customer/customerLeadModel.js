import Mongoose from "mongoose";

const CustomerLeadSchema = new Mongoose.Schema(
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
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    distance: {
      type: Number,
      default: 0,
    },
    otherInformation: {
      type: String,
      default: "",
    },
    otherNote: {
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
    estimaitonSent: {
      type: Boolean,
      default: false,
    },
    estimaitonSentDate: {
      type: String,
      default: "",
    },
    autoReminderEmail: {
      type: Boolean,
      default: true,
    },
    estimaitonStatus: {
      type: String,
      default: "Lead Added",
    },

    leadInvoinceNo: {
      type: String,
      default: "C1000001",
    },
    spouse: {
      type: [
        {
          name: { type: String },
          email: { type: String },
          phone: { type: String},
          otherInfo: { type: String}, 
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const CustomerLeadModel = Mongoose.model("CustomerLead", CustomerLeadSchema);
export default CustomerLeadModel;
