import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addUnit,
  UnitList,
  Update,
  Remove,
  Details,
} from "../controller/unitController/unitController.js";

const UnitRoute = express.Router();

// Unit
UnitRoute.post("/add", authProtect, addUnit);
UnitRoute.get("/list", authProtect, UnitList);
UnitRoute.post("/update", authProtect, Update);
UnitRoute.post("/remove", authProtect, Remove);
UnitRoute.post("/details", authProtect, Details);

export default UnitRoute;
