import mongoose from "mongoose";
import mongooseAutopopulate from "mongoose-autopopulate";

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 */
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
     * @sample = "###hours_id*@@@laborCharge_id*@@@markup_id" and for pre definded formula we use "***"
     */
    type: String,
    required: true,
  },
  formulaToShow: {
    /**
     * formula to show on screen
     * @sample - "Hours * Labor Charge * Markup"
     */
    type: String,
    required: true,
  },
  children: {
    type: [mongoose.Types.ObjectId],
    ref: "Formula",
    autopopulate: true,
  },
});

FormulaSchema.plugin(mongooseAutopopulate);

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 */
FormulaSchema.pre("save", function (next) {
  /**
   * @summary: validate the formula before saving in database
   * @description: the validation is for bracket balancing and arthmatic operations.
   */
  let formula = this;
  if (!formula.isModified("formulaToShows")) {
    return next();
  }

  const bracketValidation = validateBrackets(formula.formula);
  const arthmaticValidation = validateArthmaticOperations(formula.formula);
  if (!bracketValidation.isValid || !arthmaticValidation.isValid) {
    return next(
      new Error(
        bracketValidation.isValid
          ? arthmaticValidation.message
          : bracketValidation.message
      )
    );
  }
});

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 */
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
          message: `bracket is not balanced at index ${i}`,
        };
      }
      stack.pop();
    }
  }
  return {
    isValid: stack.length === 0,
    message:
      stack.length === 0
        ? "bracket is balanced"
        : `bracket is not balanced  at index ${stack[stack.length - 1].index}`,
  };
}

function validateArthmaticOperations(formula) {
  /**
   * @summary: validate the arthmatic operations
   * @description: the validation is for the arthmatic operations to be valid.
   */

  const sign = ["+", "-", "*", "/"];
  if (sign.includes(formula[0]) || sign.includes(formula[formula.length - 1])) {
    return {
      isValid: false,
      message: `invalid expression at index ${
        sign.includes(formula[0]) ? 0 : formula.length - 1
      }`,
    };
  }
  let prev = "";
  for (let i = 0; i < formula.length; i++) {
    if (sign.includes(prev) && sign.includes(formula[i])) {
      return {
        isValid: false,
        message: `invalid expression at index ${i}`,
        idx: i,
      };
    }
    prev = formula[i];
  }
  return {
    isValid: true,
    message: "valid expression",
  };
}

const FormulaModel = mongoose.model("Formula", FormulaSchema);
export default FormulaModel;
