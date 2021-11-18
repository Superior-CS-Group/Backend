import express from "express";
import { authProtect } from "../controller/authController.js";

import { addStaff, updateStaff, } from "../controller/staff/staffController.js";

const StaffRoute = express.Router();

// Staff
StaffRoute.post("/add-staff", authProtect, addStaff);
StaffRoute.post("/update-info", authProtect, updateStaff);

export default StaffRoute;
