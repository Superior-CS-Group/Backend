import Mongoose from "mongoose";

const UnitSchema = new Mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true
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

const UnitModel = Mongoose.model("Unit", UnitSchema);
export default UnitModel;
