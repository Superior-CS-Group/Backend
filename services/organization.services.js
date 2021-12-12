import OrganizationModel from "../model/organization/v1/organization.model.js";
import { validateCreateOrganizationInput } from "../validator/organization/organizaiton.validator.js";

export async function createOrganization(input) {
  console.log("input: ", input);
  const { isValid, errors } = validateCreateOrganizationInput(input);

  if (!isValid) {
    throw new Error(errors);
  }
  return await OrganizationModel.create(input);
}
