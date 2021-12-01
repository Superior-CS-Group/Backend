import express from "express";
import { authProtect } from "../../controller/authController.js";
import {
  createCatalog,
  createVariation,
  getCatalogs,
  getVariationsByCatalog,
  searchCatalogByName,
  updateCatalog,
  RemoveCatelog,
  updateVariation,
  RemoveVariation,
  getVariationsData,
} from "../../controller/v2/catalog/catalog.controller.js";

const CatalogRouteV2 = express.Router();

CatalogRouteV2.post("/create-catalog", authProtect, createCatalog);
CatalogRouteV2.post("/create-variation", authProtect, createVariation);
CatalogRouteV2.post("/update-catalog/", updateCatalog);
CatalogRouteV2.post("/update-variation/", updateVariation);
CatalogRouteV2.post("/remove-catalog", authProtect, RemoveCatelog);
CatalogRouteV2.post("/remove-variation", authProtect, RemoveVariation);
CatalogRouteV2.post("/get-variation", getVariationsData);
CatalogRouteV2.get("/get-all-catalog", getCatalogs);
CatalogRouteV2.get("/get-all-variation-by-catalog", getVariationsByCatalog);
CatalogRouteV2.get("/search-catalog-by-name/:catalogName", searchCatalogByName);

export default CatalogRouteV2;
