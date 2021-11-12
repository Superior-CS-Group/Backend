import Mongoose from "mongoose";

const ServicesSchema = new Mongoose.Schema(
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

const ServiceseModel = Mongoose.model("Services", ServicesSchema);
export default ServiceseModel;
