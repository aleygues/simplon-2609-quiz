import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../db";
import Cookies from "cookies";

export function checkUser(roles: string[] = []) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const cookies = new Cookies(req, res);
    const token = cookies.get("token");
    // req.headers.cookie

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
      if (roles.includes(user.role) === false) {
        res.status(403).json({
          message: "access denied",
        });
        return;
      }

      delete user.hashed_password;
      (req as any).user = user;
      next();
    } catch {
      res.status(403).json({
        message: "access denied",
      });
      return;
    }
  };
}
