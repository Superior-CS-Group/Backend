import Validator from "validator";
import isEmpty from "is-empty";

/**
 * @author digimonk technologies
 * @developer Saral Shrivastava
 * @version 1.0.0
 * @param {object} data
 */
const validateAddNewFormulaInput = (data) => {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.clientContract = !isEmpty(data.clientContract)
    ? data.clientContract
    : "";
  data.elements = !isEmpty(data.elements)
    ? data.elements
    : [
        {
          name: "Total Cost",
          unit: "",
          view: "client",
          value: "",
          automatic: true,
          color: "gray",
        },
        {
          name: "Gross Profit",
          unit: "",
          view: "client",
          value: "",
          automatic: true,
        },
        {
          name: "Markup",
          unit: "",
          view: "client",
          value: "",
          automatic: true,
          color: "gray",
        },
      ];
  data.materials = !isEmpty(data.materials) ? data.materials : [];

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title Field is required";
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

export default validateAddNewFormulaInput;
