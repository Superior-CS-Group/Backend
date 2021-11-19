import mongoose from "mongoose";

const FormulaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  customId: {
    /**
     * store the custom id which is stored in formula
     */
    type: String,
    required: true,
  },
  formula: {
    /**
     * formula used to evaluate the value
     */
    type: String,
    required: true,
  },
  formulaToShow: {
    /**
     * formula to show on screen
     */
    type: String,
    required: true,
  },
  chidlren: {
    type: [mongoose.Types.ObjectId],
    ref: "Formula",
  },
});

const FormulaModel = mongoose.model("Formula", FormulaSchema);

FormulaSchema.pre("save", (next) => {
  /**
   * @summary: validate the formula before saving in database
   * @description: the validation is for bracket balancing and arthmatic operations.
   */
  let formula = this;
  if (!formula.isModified("formula")) {
    return next();
  }
});

function validateBrackets(formula) {
  /**
   * @summary: validate the bracket balance
   * @description: the validation is for bracket balancing.
   */
  let stack = [];
  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === "(") {
      stack.push({ symbol: formula[i], index: i });
    } else if (formula[i] === ")") {
      if (stack.length === 0) {
        return {
          isValid: false,
          message: "bracket is not balanced",
          idx: i,
        };
      }
      stack.pop();
    }
  }
  return {
    isValid: stack.length === 0,
    message:
      stack.length === 0 ? "bracket is balanced" : "bracket is not balanced",
    idx:
      stack[stack.length - 1].index === undefined
        ? -1
        : stack[stack.length - 1].index,
  };
}

function validateArthmaticOperations(formula) {
  /**
   * @summary: validate the arthmatic operations
   * @description: the validation is for the arthmatic operations to be valid.
   */
  
}

export default FormulaModel;
