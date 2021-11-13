import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addServiceCatelog,
  ListServiceCatelog,
  DetailServiceCatelog,
  updateServiceCatelog,
} from "../controller/services/servicesController.js";

const ServicesRoute = express.Router();

ServicesRoute.post("/add", authProtect, addServiceCatelog);
ServicesRoute.get("/list", authProtect, ListServiceCatelog);
ServicesRoute.post("/details", authProtect, DetailServiceCatelog);
ServicesRoute.post("/update", authProtect, updateServiceCatelog);

export default ServicesRoute;
