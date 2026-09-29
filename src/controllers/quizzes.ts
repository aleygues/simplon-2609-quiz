import express from "express";
import { db } from "../db";

export async function createQuiz(
  req: express.Request,
  res: express.Response,
) {
  // req.body has already been validated by the validate middleware
  const { title } = req.body;

  const result = await db.query(
    "INSERT INTO quizzes (title) VALUES ($1) RETURNING *",
    [title],
  );
  const quiz = result.rows[0];

  res.status(201).json(quiz);
}
