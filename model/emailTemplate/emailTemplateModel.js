import Mongoose from "mongoose";

const EmailTemplateSchema = new Mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true
    },
    headerPart: {
      type: String, 
    },
    subject: {
      type: String, 
      required: true
    },
    bodyPart: {
      type: String, 
      required: true
    },
    footerPart: {
      type: String,
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmailTemplateModel = Mongoose.model("EmailTemplate", EmailTemplateSchema);
export default EmailTemplateModel;
