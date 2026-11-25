import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongodb";
import Cookies from "cookies";
import { User } from "../entities/User";

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
      ) as { userId: string };

      if (!payload.userId) {
        res.status(403).json({
          message: "access denied",
        });
        return;
      }

      const user = await User.findOneBy({ id: new ObjectId(payload.userId) });

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

      delete (user as any).hashedPassword;
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
