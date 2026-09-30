import express from "express";
import { db } from "../db";
import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";

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

export async function createToken(req: express.Request, res: express.Response) {
  // req.body has already been validated by the validate middleware
  const { email, password } = req.body;

  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  const user = result.rows[0];

  if (
    !user ||
    (await argon2.verify(user.hashed_password, password)) === false
  ) {
    res.status(400).json({ message: "invalid credentials" });
    return;
  }

  const token = jsonwebtoken.sign(
    {
      userId: user.id,
      // iat: Date.now() / 1000
    },
    process.env.JWT_SECRET as string,
  );

  res.status(201).json({
    token,
  });
}
