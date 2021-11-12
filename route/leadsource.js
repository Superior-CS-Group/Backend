import express from "express";
import { authProtect } from "../controller/authController.js";
 

import {
  addLeadSource,
  LeadSourceList,
  ChangeStatus,
  LeadSourceRemove,
} from "../controller/admin/leadSourceController.js";
 

const LeadSourceRoute = express.Router();
 

// Lead Source
LeadSourceRoute.post("/add-lead-source", addLeadSource);
LeadSourceRoute.get("/lead-source-list", authProtect, LeadSourceList);
LeadSourceRoute.post("/update-status", authProtect, ChangeStatus);
LeadSourceRoute.post("/remove-lead-source", authProtect, LeadSourceRemove);
 

export default LeadSourceRoute;
