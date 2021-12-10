import express from "express";
import { authProtect } from "../controller/authController.js";

import {
  addQuestion,
  QuestionList,
  NextQuestion,
  Update,
  Details,
  Remove,
} from "../controller/questionController/questionController.js";

const QuestionRoute = express.Router();

QuestionRoute.post("/add", authProtect, addQuestion);
QuestionRoute.post("/details", authProtect, Details);
QuestionRoute.post("/remove", authProtect, Remove);
QuestionRoute.post("/update", authProtect, Update);
QuestionRoute.get("/list", authProtect, QuestionList);
QuestionRoute.post("/next", authProtect, NextQuestion);

export default QuestionRoute;
