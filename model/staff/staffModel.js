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
      default: false,
    },
    companyName: {
      type: String,
      default: "",
    }, 
    companyImage: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "",
    },
    userRole: {
      type: String,
      default: "user",
    },
    contactNo: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    timeZone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const StaffModel = Mongoose.model("User", StaffSchema);
export default StaffModel;
