import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  membserList,
  membserActiveStatus,
  membserRemove,
} from "../controller/admin/customerController.js";

import {
  updateEmailSetting,
  getEmailSetting,
  changePassword,
} from "../controller/admin/emailSettingController.js";

import {
  addLeadSource,
  LeadSourceList,
  ChangeStatus,
  LeadSourceRemove,
} from "../controller/admin/leadSourceController.js";

import { addStaff } from "../controller/admin/staffController.js";

import {
  addLead,
  UpcomingEstimaitonLead,
} from "../controller/admin/leadController.js";

import { addUserRole } from "../controller/admin/userRolePermisionController.js";

const AdminRoute = express.Router();

// UserRole
AdminRoute.post("/add-user-role", authProtect, addUserRole);

// Lead
AdminRoute.post("/add-lead", authProtect, addLead);
AdminRoute.get("/upcoming-estimation", authProtect, UpcomingEstimaitonLead);

// Staff
AdminRoute.post("/add-staff", addStaff);

// Lead Source
AdminRoute.post("/add-lead-source", addLeadSource);
AdminRoute.get("/lead-source-list", authProtect, LeadSourceList);
AdminRoute.post("/update-status", authProtect, ChangeStatus);
AdminRoute.post("/remove-lead-source", authProtect, LeadSourceRemove);

AdminRoute.post("/get-email-setting", authProtect, getEmailSetting);
AdminRoute.post("/update-email-setting", authProtect, updateEmailSetting);
AdminRoute.post("/update-password", authProtect, changePassword);

AdminRoute.get("/member-list", authProtect, membserList);
AdminRoute.post("/member-status", authProtect, membserActiveStatus);
AdminRoute.post("/member-remove", authProtect, membserRemove);

export default AdminRoute;
