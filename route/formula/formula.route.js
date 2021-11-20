import express from "express";
import {
  addNewFormulaHandler,
  getFormulaByIdHandler,
  updateFormulaByIdHandler,
} from "../../controller/formula/formula.controller.js";

const FormulaRoute = express.Router();

FormulaRoute.post("/add-new-formula", addNewFormulaHandler);
FormulaRoute.put("/update-formula-by-id/:id", updateFormulaByIdHandler);
FormulaRoute.get("/get-formula-by-id/:id", getFormulaByIdHandler);

export default FormulaRoute;
