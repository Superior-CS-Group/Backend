import Validator from "validator";
import isEmpty from "is-empty";

export const validateCreateCatalogInput = (data) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.unit = !isEmpty(data.unit) ? data.unit : "";
  data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type Field is required";
  } else if (data.type !== "catalog" && data.type !== "subCatalog") {
    errors.type = "Type Field is invalid";
  } else if (data.type === "catalog") {
    if (Validator.isEmpty(data.price)) {
      errors.price = "Price Field is required";
    }
    if (Validator.isEmpty(data.unit)) {
      errors.unit = "Unit Field is required";
    }
    if (Validator.isEmpty(data.quantity)) {
      errors.quantity = "Quantity Field is required";
    }
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

export const validateCreateVariationInput = (data) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.unit = !isEmpty(data.unit) ? data.unit : "";
  data.quantity = !isEmpty(data.quantity) ? data.quantity : "";
  data.catelogId = !isEmpty(data.catelogId) ? data.catelogId : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Field is required";
  }
  if (Validator.isEmpty(data.price)) {
    errors.price = "Price Field is required";
  }
  if (Validator.isEmpty(data.unit)) {
    errors.unit = "Unit Field is required";
  }
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = "Quantity Field is required";
  }
  if (Validator.isEmpty(data.materialId)) {
    errors.catelogId = "Catelog Id Field is required";
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};
