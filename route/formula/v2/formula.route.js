import express from "express";
import {
  addNewFormulaHandler,
  deleteFormulaByIdHandler,
  getAllFormulaHandler,
  getFormulaByIdHandler,
  searchFormulaByName,
  updateFormulaByIdHandler,
} from "../../../controller/formula/v2/formula.controller.js";

import { authProtect } from "../../../controller/authController.js";
const FormulaRouteV2 = express.Router();

FormulaRouteV2.post("/add-new-formula", authProtect, addNewFormulaHandler);
FormulaRouteV2.put(
  "/update-formula-by-id/:formulaId",
  authProtect,
  updateFormulaByIdHandler
);
FormulaRouteV2.delete(
  "/delete-formula-by-id/:formulaId",
  authProtect,
  deleteFormulaByIdHandler
);
FormulaRouteV2.get("/get-formula-by-id/:formulaId", getFormulaByIdHandler);
FormulaRouteV2.get("/get-all-formula", getAllFormulaHandler);
FormulaRouteV2.get("/search-formula-by-name/:searchTerm", searchFormulaByName);
export default FormulaRouteV2;
