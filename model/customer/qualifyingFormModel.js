import Mongoose from "mongoose";

const QualifyingFormSchema = new Mongoose.Schema(
  {
    customerId: {
      type: [Mongoose.Types.ObjectId],
      ref: "CustomerLead",
    },
    leadPerson: {
      type: [Mongoose.Types.ObjectId],
      ref: "User",
    },
     
    question: {
      type: [
        {
          questionId: { type: String },
          questionInputType: { type: String },
          questionValue: { type: Array},
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const QualifyingFormModel = Mongoose.model("CustomerQualifyingForm", QualifyingFormSchema);
export default QualifyingFormModel;
