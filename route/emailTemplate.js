import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addEmail,
  TemplateList,
} from "../controller/emailTemplateController/emailTemplateController.js";

const EmailTemplateRoute = express.Router();

// Unit
EmailTemplateRoute.post("/add", authProtect, addEmail);
EmailTemplateRoute.get("/list", authProtect, TemplateList);

export default EmailTemplateRoute;
