import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addUserRole,
  UserRoleList,
} from "../controller/userRoleController/userRolePermisionController.js";

const UserRoleRoute = express.Router();

// UserRole
UserRoleRoute.post("/add-user-role", authProtect, addUserRole);
UserRoleRoute.get("/list-user-role", authProtect, UserRoleList);

export default UserRoleRoute;
