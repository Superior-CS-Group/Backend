import mongoose from "mongoose";

/**
 * @author digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 2.0.0
 */
const FormulaSchema = new mongoose.Schema(
  {
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
            enum: [
              "manual",
              "prefilled",
              "result_editable",
              "result_locked",
              "dropdown",
              "boolean",
            ],
          },
          unit: {
            type: String,
            ref: "Unit",
          },
          dropdown: {
            type: String,
            default: "",
          },
          view: {
            type: [String],
            enum: ["client", "internal", "full"],
            default: ["client", "internal", "full"],
          },
          value: {
            type: String,
          },
          automatic: {
            type: Boolean,
            default: false,
          },
          disabled: {
            type: Boolean,
            default: false,
          },
          color: {
            type: String,
            default: "#00ac07",
          },
          formula: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "CatalogV2",
          },
          customInput: {
            type: [
              {
                name: { type: String },
                value: { type: String },
              },
            ],
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
          manual: {
            type: Boolean,
            default: false,
          },
          type: {
            type: String,
            enum: ["material", "labor", "subcontractor"],
            default: "material",
          },
          formula: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "CatalogV2",
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
    catalogs: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "CatalogV2",
    },
  },
  {
    timestamps: true,
  }
);

const FormulaModelV2 = mongoose.model("FormulaV2", FormulaSchema);
export default FormulaModelV2;
