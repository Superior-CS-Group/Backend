import express from "express";
import { authProtect } from "../../../controller/authController.js";
import {
  createUserEstimation,
  deleteUserEstimation,
  getUserEstimation,
  getUserEstimationDetailsById,
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

UserEstimationRoute.delete(
  "/delete-user-estimation/:estimationId",
  authProtect,
  deleteUserEstimation
);

UserEstimationRoute.get(
  "/get-user-estimation/:userId",
  authProtect,
  getUserEstimation
);

UserEstimationRoute.get(
  "/get-user-estimation-details-by-id/:estimationId",
  authProtect,
  getUserEstimationDetailsById
);

export default UserEstimationRoute;
