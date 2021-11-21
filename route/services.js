import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addServiceCatelog,
  ListServiceCatelog,
  DetailServiceCatelog,
  updateServiceCatelog,
  RemoveServiceCatelog,
  RemoveServiceCatelogVariation,
  ListServiceCatelogByType,
  VariationListServiceCatelog,
  searchCatelogByName,
  getVariationByCatelogId,
} from "../controller/services/servicesController.js";

const ServicesRoute = express.Router();

ServicesRoute.post("/add", authProtect, addServiceCatelog);
ServicesRoute.get("/list", authProtect, ListServiceCatelog);
ServicesRoute.get("/variation-list", authProtect, VariationListServiceCatelog);
ServicesRoute.post("/list-by-type", authProtect, ListServiceCatelogByType);
ServicesRoute.post("/details", authProtect, DetailServiceCatelog);
ServicesRoute.post("/update", authProtect, updateServiceCatelog);
ServicesRoute.post(
  "/remove-service-catelog",
  authProtect,
  RemoveServiceCatelog
);
ServicesRoute.post(
  "/remove-service-catelog-variation",
  authProtect,
  RemoveServiceCatelogVariation
);

ServicesRoute.get("/search-catelog-by-name", authProtect, searchCatelogByName);
ServicesRoute.get(
  "/get-variation-by-catelog-id/:catelogId",
  authProtect,
  getVariationByCatelogId
);

export default ServicesRoute;
