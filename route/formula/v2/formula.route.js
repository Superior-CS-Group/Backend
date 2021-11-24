import express from "express";
import {
  addNewFormulaHandler,
  getAllFormulaHandler,
  getFormulaByIdHandler,
  searchFormulaByName,
  updateFormulaByIdHandler,
} from "../../../controller/formula/v2/formula.controller.js";

const FormulaRouteV2 = express.Router();

FormulaRouteV2.post("/add-new-formula", addNewFormulaHandler);
FormulaRouteV2.put(
  "/update-formula-by-id/:formulaId",
  updateFormulaByIdHandler
);
FormulaRouteV2.get("/get-formula-by-id/:formulaId", getFormulaByIdHandler);
FormulaRouteV2.get("/get-all-formula", getAllFormulaHandler);
FormulaRouteV2.get("/search-formula-by-name/:searchTerm", searchFormulaByName);
export default FormulaRouteV2;
