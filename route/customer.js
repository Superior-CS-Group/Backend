import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  getUserDetails,
  signIn,
  signUp,
  activateAccount,
  recoverPassword,
  changePassword,
  updateAccount,
  removeProfileImage,
  changeEmail,
  updateEmail,
  notificationSettings,
  getUserList,
  removeUserDetails,
  updateAccountStatus,
  updateIsadminStatus,
} from "../controller/userController.js";

import {
  addLead,
  UpcomingEstimaitonLead,
  assignCustomerLead,
  updateCustomerInfo,
  GetInfoCustomerLead,
  CustomerLeadRemove,
} from "../controller/customer/customerController.js";

const UserRoute = express.Router();

// Lead
UserRoute.post("/add", authProtect, addLead);
UserRoute.post("/update-info", authProtect, updateCustomerInfo);
UserRoute.post("/assign-lead", authProtect, assignCustomerLead);
UserRoute.get("/upcoming-estimation", authProtect, UpcomingEstimaitonLead);
UserRoute.post("/get-info", authProtect, GetInfoCustomerLead);
UserRoute.post("/delete-lead", authProtect, CustomerLeadRemove);

// Customer Profile
UserRoute.post("/sign-up", signUp);
UserRoute.post("/sign-in", signIn);
UserRoute.post("/activate-account", activateAccount);
UserRoute.post("/recover-password-link", recoverPassword);
UserRoute.post("/change-password", changePassword);

UserRoute.post("/change-email-link", changeEmail);
UserRoute.post("/update-email", updateEmail);

UserRoute.get("/get-user-details", authProtect, getUserDetails);
UserRoute.get("/user-list", authProtect, getUserList);
UserRoute.get("/user-delete", authProtect, removeUserDetails);
UserRoute.post("/update", authProtect, updateAccount);
UserRoute.post("/update-status", authProtect, updateAccountStatus);
UserRoute.post("/update-isadmn-status", authProtect, updateIsadminStatus);
UserRoute.get("/remove-profile-image", authProtect, removeProfileImage);
UserRoute.post("/notification-settings", authProtect, notificationSettings);

export default UserRoute;
