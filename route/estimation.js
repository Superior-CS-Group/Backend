import express from "express";
import { authProtect } from "../controller/authController.js";
 
import {
  addLead,
  UpcomingEstimaitonLead,
} from "../controller/estimation/leadController.js";
 

const estimationRoute = express.Router();
 

// Lead
estimationRoute.get("/upcoming-estimation", authProtect, UpcomingEstimaitonLead);

export default estimationRoute;
