import Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema(
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
    puttingYourFirst: {
      type: Boolean,
      default: true,
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
    userRole: {
      type: String,
      default: "customer",
    },
    leadSource: {
      type: String,
      default: "Website",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = Mongoose.model("Customer", UserSchema);
export default UserModel;
