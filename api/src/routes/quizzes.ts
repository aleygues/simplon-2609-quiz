import express from "express";
import { createQuiz, deleteQuizz } from "../controllers/quizzes";
import { validate } from "../middlewares/validate";
import { createQuizSchema } from "../schemas/quizzes";
import { checkUser } from "../middlewares/checkUser";
import { checkOwnership } from "../middlewares/checkOwnership";

export const quizzesRouter = express.Router();

quizzesRouter.post(
  "/",
  checkUser(["admin", "contributor"]),
  validate(createQuizSchema),
  createQuiz,
);

quizzesRouter.delete(
  "/:id",
  checkUser(["admin", "contributor"]),
  checkOwnership("quizzes", { allowAdmins: true }),
  deleteQuizz,
);
