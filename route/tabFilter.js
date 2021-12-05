import express from "express";
import { authProtect } from "../controller/authController.js";
import {
  addTab,
  listTab,
  removeTab,
} from "../controller/tabController/tabFilter.js";
const TabFilterRoute = express.Router();

TabFilterRoute.post("/add", addTab);
TabFilterRoute.get("/list", listTab);
TabFilterRoute.post("/delete", removeTab);
removeTab;
export default TabFilterRoute;
