import OrganizationModel from "../../model/organization/v1/organization.model.js";
import StaffModel from "../../model/staff/staffModel.js";
import { createOrganization } from "../../services/organization.services.js";
import base64ToFile from "../../utils/base64ToFile.js";
import customRegex from "../../utils/regex.js";

export async function getOrganizationDetails(req, res) {
  let organizationId = req.user.organization;
  if (!organizationId) {
    console.log(organizationId);
    try {
      organizationId = await createOrganization({
        name: req.user.companyName,
        phoneNumber: req.user.contactNo || "1234567890",
      });
      console.log("organizaitonId", organizationId);

      await StaffModel.findByIdAndUpdate(req.user._id, {
        organization: organizationId,
      });
    } catch (errors) {
      return res.status(400).json({ errors });
    }
  }
  const organizationDetails = await OrganizationModel.findById(organizationId);
  if (!organizationDetails) {
    return res.status(404).json({
      errors: {
        message: "Organization not found",
        data: {},
      },
    });
  }
  return res.status(200).json({ data: organizationDetails });
}

export async function updateOrganizationDetails(req, res) {
  let organizationId = req.user.organization;

  const fieldsToUpdate = {};
  const keys = Object.keys(req.body);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const field = req.body[key].match(customRegex.base64);
      if (field) {
        const url = await base64ToFile(
          req.body[key].replace(customRegex.base64, ""),
          organizationId,
          `organizaiton/${key}`
        );
        fieldsToUpdate[key] = url;
      } else {
        fieldsToUpdate[key] = req.body[key];
      }
    } catch (error) {
      return res.status(400).json({ errors: error });
    }
  }
  try {
    const newOrganizationDetails = await OrganizationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: { ...fieldsToUpdate },
      },
      { new: true }
    );
    return res.status(200).json({ data: newOrganizationDetails });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTermAndConditions(req, res) {
  const organizationId = req.user.organization;

  try {
    const newOrganizationDetails = await OrganizationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: {
          termsAndConditions: req.body.termsAndConditions,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ data: newOrganizationDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePaymentTerms(req, res) {
  const organizationId = req.user.organization;

  try {
    const newOrganizationDetails = await OrganizationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: { paymentTerms: req.body.paymentTerms },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ data: newOrganizationDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
