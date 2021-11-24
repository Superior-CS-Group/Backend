import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addLead,
  UpcomingEstimaitonLead,
  sentEstimation,
} from "../controller/estimation/estimationController.js";

const estimationRoute = express.Router();

// Lead
estimationRoute.post("/add-lead", authProtect, addLead);
estimationRoute.get(
  "/upcoming-estimation",
  authProtect,
  UpcomingEstimaitonLead
);
estimationRoute.post("/sent-estimate", authProtect, sentEstimation);

export default estimationRoute;
