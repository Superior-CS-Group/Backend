import Mongoose from "mongoose";

const UserRolePermisionSchema = new Mongoose.Schema(
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

const UserRolePermisionModel = Mongoose.model("UserRole", UserRolePermisionSchema);
export default UserRolePermisionModel;
