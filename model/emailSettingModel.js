import  mongoose from "mongoose";

const EmailSettingSchema = mongoose.Schema(
  {
    host: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EmailSettingModel = mongoose.model("SMTPEmail", EmailSettingSchema);
export default EmailSettingModel;