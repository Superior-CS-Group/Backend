import Mongoose from "mongoose";

const UserRoleSchema = new Mongoose.Schema(
  {
    
    name: {
      type: String,
      default: "",
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

const UserRoleModel = Mongoose.model("UserRole", UserRoleSchema);
export default UserRoleModel;
