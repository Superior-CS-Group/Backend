import express from "express";
import { authProtect } from "../controller/authController.js";



import { addStaff } from "../controller/staff/staffController.js";


const StaffRoute = express.Router();


// Staff
StaffRoute.post("/add-staff",authProtect, addStaff);


export default StaffRoute;
