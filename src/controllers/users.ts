import express from "express";
import { db } from "../db";
import argon2 from "argon2";

export async function createUser(req: express.Request, res: express.Response) {
  // req.body has already been validated by the validate middleware
  const { email, password } = req.body;

  const hashedPassword = await argon2.hash(password);

  const result = await db.query(
    "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING *",
    [email, hashedPassword],
  );
  const user = result.rows[0];

  delete user.hashed_password;

  res.status(201).json(user);
}
