import express from "express";
import { authProtect } from "../controller/authController.js";
 

import {
  updateEmailSetting,
  getEmailSetting,
  changePassword,
} from "../controller/admin/emailSettingController.js";
   

const AdminRoute = express.Router();
 

AdminRoute.post("/get-email-setting", authProtect, getEmailSetting);
AdminRoute.post("/update-email-setting", authProtect, updateEmailSetting);
AdminRoute.post("/update-password", authProtect, changePassword);
 

export default AdminRoute;
