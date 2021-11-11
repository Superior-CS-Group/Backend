import Mongoose from "mongoose";

const StaffSchema = new Mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    password_reset_token: {
      type: String,
      default: "",
    },
    email_reset_token: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
    userRole: {
      type: String,
      default: "staff",
    },
  },
  {
    timestamps: true,
  }
);

const StaffModel = Mongoose.model("User", StaffSchema);
export default StaffModel;
