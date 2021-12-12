import express from "express";
import { authProtect } from "../controller/authController.js";
import {
  addTab,
  listTab,
  removeTab,
  updateTab,
  updateTabColOrder,
} from "../controller/tabController/tabFilter.js";
const TabFilterRoute = express.Router();

TabFilterRoute.post("/add", authProtect, addTab);
TabFilterRoute.get("/list", authProtect, listTab);
TabFilterRoute.post("/delete", authProtect, removeTab);
TabFilterRoute.post("/update/:id", authProtect, updateTab);
TabFilterRoute.post("/update-col/:id", authProtect, updateTabColOrder);

export default TabFilterRoute;
