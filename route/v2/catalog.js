import express from "express";
import { authProtect } from "../../controller/authController.js";
import {
  createCatalog,
  createService,
  createVariation,
  getCatalogs,
  getServices,
  getVariationsByCatalog,
  searchCatalogByName,
  updateCatalog,
  updateService,
} from "../../controller/v2/catalog/catalog.controller.js";

const CatalogRouteV2 = express.Router();

CatalogRouteV2.post("/create-catalog", authProtect, createCatalog);
CatalogRouteV2.post("/create-variation", authProtect, createVariation);
CatalogRouteV2.post("/create-service", authProtect, createService);
CatalogRouteV2.put("/update-catalog/:catalogId", authProtect, updateCatalog);
CatalogRouteV2.put("/update-service/:serviceId", authProtect, updateService);
CatalogRouteV2.get("/get-all-catalog", getCatalogs);
CatalogRouteV2.get("/get-all-services", getServices);
CatalogRouteV2.get("/get-all-variation-by-catalog", getVariationsByCatalog);
CatalogRouteV2.get("/search-catalog-by-name/:catalogName", searchCatalogByName);

export default CatalogRouteV2;
