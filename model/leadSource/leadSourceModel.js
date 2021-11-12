import Mongoose from "mongoose";

const LeadSourceSchema = new Mongoose.Schema(
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

const LeadSourceModel = Mongoose.model("LeadSource", LeadSourceSchema);
export default LeadSourceModel;
