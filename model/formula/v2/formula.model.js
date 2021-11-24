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
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["manual", "prefilled", "result_editable", "result_locked"],
          required: true,
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
      },
    ],
    default: [
      {
        name: "Total Cost",
        unit: "",
        view: "client",
        value: "",
      },
      {
        name: "Gross Profit",
        unit: "",
        view: "client",
        value: "",
      },
      {
        name: "Markup",
        unit: "",
        view: "client",
        value: "",
      },
    ],
  },
  materials: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        cost: {
          type: String,
          required: true,
        },
        charge: {
          type: String,
          required: true,
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
