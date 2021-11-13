import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addServiceCatelog,
  ListServiceCatelog,
} from "../controller/services/servicesController.js";

const ServicesRoute = express.Router();

ServicesRoute.post("/add", authProtect, addServiceCatelog);
ServicesRoute.post("/list", authProtect, ListServiceCatelog);

export default ServicesRoute;
