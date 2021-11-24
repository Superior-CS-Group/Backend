import mongoose from "mongoose";

/**
 * @author digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 2.0.0
 */
const FormulaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  elements: {
    type: [
      {
        name: { type: String },
        type: {
          type: String,
          enum: ["manual", "prefilled", "result_editable", "result_locked"],
        },
        unit: {
          type: String,
          ref: "Unit",
        },
        view: {
          type: String,
          enum: ["client", "internal", "fulls"],
        },
        value: {
          type: String,
        },
        automatic: {
          type: Boolean,
          default: false,
        },
        color: {
          type: String,
          default: "#00ac07",
        },
      },
    ],
  },
  materials: {
    type: [
      {
        name: {
          type: String,
        },
        quantity: {
          type: String,
        },
        cost: {
          type: String,
        },
        charge: {
          type: String,
        },
      },
    ],
  },
  clientContract: {
    type: String,
  },
  photo: {
    type: String,
    default: "",
  },
});

const FormulaModelV2 = mongoose.model("FormulaV2", FormulaSchema);
export default FormulaModelV2;
