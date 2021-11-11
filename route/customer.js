import express from "express"
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
  notificationSettings
} from "../controller/userController.js";
 
import {
  addLead,
  UpcomingEstimaitonLead,
} from "../controller/estimation/leadController.js";

const UserRoute = express.Router();


// Lead
UserRoute.post("/add-lead", authProtect, addLead);
UserRoute.get("/upcoming-estimation", authProtect, UpcomingEstimaitonLead);



UserRoute.post("/sign-up", signUp);
UserRoute.post("/sign-in", signIn);
UserRoute.post("/activate-account", activateAccount);
UserRoute.post("/recover-password-link", recoverPassword);
UserRoute.post("/change-password", changePassword);

UserRoute.post("/change-email-link", changeEmail);
UserRoute.post("/update-email", updateEmail);

UserRoute.get("/get-user-details", authProtect, getUserDetails);
UserRoute.post("/update-user-data", authProtect, updateAccount);
UserRoute.get("/remove-profile-image", authProtect, removeProfileImage);
UserRoute.post("/notification-settings", authProtect, notificationSettings);

export default UserRoute;
