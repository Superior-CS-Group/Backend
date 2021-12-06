import express from "express";
import { authProtect } from "../controller/authController.js";
import {
  addTab,
  listTab,
  removeTab,
} from "../controller/tabController/tabFilter.js";
const TabFilterRoute = express.Router();

TabFilterRoute.post("/add", authProtect, addTab);
TabFilterRoute.get("/list", authProtect, listTab);
TabFilterRoute.post("/delete", authProtect, removeTab);
removeTab;
export default TabFilterRoute;
