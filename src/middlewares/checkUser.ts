import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../db";

export async function checkUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(403).json({
      message: "access denied",
    });
    return;
  }

  const token = authorization.split(" ")[1] as string;

  if (!token) {
    res.status(403).json({
      message: "access denied",
    });
    return;
  }

  try {
    const payload = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as { userId: number };

    if (!payload.userId) {
      res.status(403).json({
        message: "access denied",
      });
      return;
    }

    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [
      payload.userId,
    ]);
    const user = result.rows[0];

    if (!user) {
      res.status(403).json({
        message: "access denied",
      });
      return;
    }

    // you may check roles here

    (req as any).user = user;
    next();
  } catch {
    res.status(403).json({
      message: "access denied",
    });
    return;
  }
}
