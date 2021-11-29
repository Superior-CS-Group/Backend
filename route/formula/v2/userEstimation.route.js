import express from "express";
import { authProtect } from "../../../controller/authController.js";
import {
  createUserEstimation,
  getUserEstimation,
  updateUserEstimation,
} from "../../../controller/formula/v2/userEstimation.controller.js";
const UserEstimationRoute = express.Router();

UserEstimationRoute.post(
  "/create-user-estimation",
  authProtect,
  createUserEstimation
);
UserEstimationRoute.put(
  "/update-user-estimation/:estimationId",
  authProtect,
  updateUserEstimation
);
UserEstimationRoute.get(
  "/get-user-estimation/:userId",
  authProtect,
  getUserEstimation
);

export default UserEstimationRoute;
