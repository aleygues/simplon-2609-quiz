import express from "express";
import { createQuiz } from "../controllers/quizzes";
import { validate } from "../middlewares/validate";
import { createQuizSchema } from "../schemas/quizzes";
import { checkUser } from "../middlewares/checkUser";

export const quizzesRouter = express.Router();

quizzesRouter.post("/", checkUser, validate(createQuizSchema), createQuiz);
