import express from "express";
import { authProtect } from "../controller/authController.js";
 

import { addUserRole } from "../controller/userRoleController/userRolePermisionController.js";

const UserRoleRoute = express.Router();

// UserRole
UserRoleRoute.post("/add-user-role", authProtect, addUserRole);
 

export default UserRoleRoute;
