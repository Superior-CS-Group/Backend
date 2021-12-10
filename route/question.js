import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addQuestion,
  QuestionList,
  NextQuestion,
  Update,
} from "../controller/questionController/questionController.js";

const UnitRoute = express.Router();

UnitRoute.post("/add", authProtect, addQuestion);
UnitRoute.post("/update", authProtect, Update);
UnitRoute.get("/list", authProtect, QuestionList);
UnitRoute.post("/next", authProtect, NextQuestion);

export default UnitRoute;
