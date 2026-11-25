import express from "express";
import { ObjectId } from "mongodb";
import { Quiz } from "../entities/Quiz";
import { User } from "../entities/User";

export async function createQuiz(req: express.Request, res: express.Response) {
  // req.body has already been validated by the validate middleware
  const { title } = req.body;

  const user: User = (req as any).user;

  const quiz = await Quiz.create({
    title,
    createdBy: { id: user.id },
  }).save();

  res.status(201).json(quiz);
}

export async function deleteQuizz(req: express.Request, res: express.Response) {
  const { id } = req.params;

  await Quiz.delete({ id: new ObjectId(id as string) });

  res.status(204).send();
}
