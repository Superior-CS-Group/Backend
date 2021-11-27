import express from "express";
import { authProtect } from "../../controller/authController";
import {
  createCatalog,
  createVariation,
  getCatalogs,
  getVariationsByCatalog,
  updateCatalog,
} from "../../controller/v2/catalog/catalog.controller";

const CatalogRouteV2 = express.Router();

CatalogRouteV2.post("/create-catalog", authProtect, createCatalog);
CatalogRouteV2.post("/create-variation", authProtect, createVariation);
CatalogRouteV2.put("/update-catalog/:catalogId", authProtect, updateCatalog);
CatalogRouteV2.get("/get-all-catalog", getCatalogs);
CatalogRouteV2.get(
  "/get-allVariation-by-catalog/:catalogId",
  getVariationsByCatalog
);

export default CatalogRouteV2;
