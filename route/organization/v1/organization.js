import express from "express";
import { authProtect } from "../../../controller/authController.js";
import {
  getOrganizationDetails,
  updateOrganizationDetails,
  updatePaymentTerms,
} from "../../../controller/organizaitonController/organization.controller.js";
const OrganizationRouteV1 = express.Router();

OrganizationRouteV1.get(
  "/get-organization-details",
  authProtect,
  getOrganizationDetails
);

OrganizationRouteV1.put(
  "/update-organization-details",
  authProtect,
  updateOrganizationDetails
);

OrganizationRouteV1.put(
  "/update-term-and-condition",
  authProtect,
  updateOrganizationDetails
);

OrganizationRouteV1.put(
  "/update-organization-payment-terms",
  authProtect,
  updatePaymentTerms
);

export default OrganizationRouteV1;
