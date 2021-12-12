import Validator from "validator";
import isEmpty from "is-empty";

export const validateCreateOrganizationInput = (data) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Organization name is required";
  }
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Phone number is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
