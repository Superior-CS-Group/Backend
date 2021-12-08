import express from "express";
import { authProtect } from "../controller/authController.js";
import {
  addTab,
  listTab,
  removeTab,
  updateTab,
} from "../controller/tabController/tabFilter.js";
const TabFilterRoute = express.Router();

TabFilterRoute.post("/add", authProtect, addTab);
TabFilterRoute.get("/list", authProtect, listTab);
TabFilterRoute.post("/delete", authProtect, removeTab);
TabFilterRoute.post("/update/:id", authProtect, updateTab);
removeTab;
export default TabFilterRoute;
