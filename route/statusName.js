import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addStatus,
  StatusList,
  Update,
  Remove,
  Details,
} from "../controller/statusNameController/statusNameController.js";

const StatusNameRoute = express.Router();

// StatusList
StatusNameRoute.post("/add", authProtect, addStatus);
StatusNameRoute.get("/list", authProtect, StatusList);
StatusNameRoute.post("/update", authProtect, Update);
StatusNameRoute.post("/remove", authProtect, Remove);
StatusNameRoute.post("/details", authProtect, Details);

export default StatusNameRoute;
