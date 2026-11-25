import express from "express";
import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";
import Cookies from "cookies";
import { User } from "../entities/User";

export async function createUser(req: express.Request, res: express.Response) {
  // req.body has already been validated by the validate middleware
  const { email, password } = req.body;

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    email,
    hashedPassword,
    role: "user",
  }).save();

  delete (user as any).hashedPassword;

  res.status(201).json(user);
}

export async function createToken(req: express.Request, res: express.Response) {
  // req.body has already been validated by the validate middleware
  const { email, password } = req.body;

  const user = await User.findOneBy({ email });

  if (
    !user ||
    (await argon2.verify(user.hashedPassword, password)) === false
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
