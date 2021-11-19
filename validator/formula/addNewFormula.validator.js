import Validator from "validator";
import isEmpty from "is-empty";

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 */
const validateAddNewFormulaInput = (data) => {
  /**
   * @summary - validate request body
   * @param {object} data - request body
   * @returns {object} - error object
   */
  const errors = {};

  // convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : "";
  data.customId = !isEmpty(data.customId) ? data.customId : "";
  data.formula = !isEmpty(data.formula) ? data.formula : "";
  data.formulaToShow = !isEmpty(data.formulaToShow) ? data.formulaToShow : "";

  // convert empty fields to an empty array
  data.children = !isEmpty(data.children) ? data.children : []; // not required

  // validate fields
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }
  if (Validator.isEmpty(data.customId)) {
    errors.customId = "Custom Id field is required";
  }
  if (Validator.isEmpty(data.formula)) {
    errors.formula = "Formula field is required";
  }
  if (Validator.isEmpty(data.formulaToShow)) {
    errors.formulaToShow = "Formula to show field is required";
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

export default validateAddNewFormulaInput;
