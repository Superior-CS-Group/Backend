import Mongoose from "mongoose";

const CustomerAttachmentSchema = new Mongoose.Schema(
  {
    customerId: {
      type: [Mongoose.Types.ObjectId],
      ref: "CustomerLead",
    },
    leadPerson: {
      type: [Mongoose.Types.ObjectId],
      ref: "User",
    },
    attachmentLable: {
      type: String,
    },
    attachment: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const CustomerAttachmentModel = Mongoose.model(
  "CustomerAttachment",
  CustomerAttachmentSchema
);
export default CustomerAttachmentModel;
