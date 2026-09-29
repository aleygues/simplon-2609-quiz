import express from "express";
import { createQuiz } from "../controllers/quizzes";
import { validate } from "../middlewares/validate";
import { createQuizSchema } from "../schemas/quizzes";

export const quizzesRouter = express.Router();

quizzesRouter.post("/", validate(createQuizSchema), createQuiz); // create quiz
