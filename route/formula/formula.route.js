import express from "express";
import {
  addNewFormulaHandler,
  getFormulaByIdHandler,
} from "../../controller/formula/formula.controller.js";

const FormulaRoute = express.Router();

FormulaRoute.post("/add-new-formula", addNewFormulaHandler);
FormulaRoute.get("/get-formula-by-id/:id", getFormulaByIdHandler);

export default FormulaRoute;
