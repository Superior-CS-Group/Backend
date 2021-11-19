import express from "express";
import { addNewFormulaHandler, getFormulaById } from "../../controller/formula/formula.controller";

const FormulaRoute = express.Router();

FormulaRoute.post("/add-new-formula", addNewFormulaHandler );
FormulaRoute.post("/get-formula-by-id/:id", getFormulaByIdHandler);

export default FormulaRoute;
