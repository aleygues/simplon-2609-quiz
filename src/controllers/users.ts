import express from "express";
import { db } from "../db";
import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";
import Cookies from "cookies";

export async function createUser(req: express.Request, res: express.Response) {
  // req.body has already been validated by the validate middleware
  const { email, password } = req.body;

  const hashedPassword = await argon2.hash(password);

  const result = await db.query(
    "INSERT INTO users (email, hashed_password, role) VALUES ($1, $2, $3) RETURNING *",
    [email, hashedPassword, "user"],
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

  const cookies = new Cookies(req, res);
  cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(201).json({
    ok: true,
  });
}

export async function getMe(req: express.Request, res: express.Response) {
  const user: { id: number; email: string } = (req as any).user;
  res.status(200).json(user);
}

export async function deleteToken(req: express.Request, res: express.Response) {
  const cookies = new Cookies(req, res);
  cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
  });

  res.status(200).json({
    ok: true,
  });
}
