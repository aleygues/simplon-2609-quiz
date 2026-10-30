import { NextFunction, Request, Response } from "express";
import { db } from "../db";

export function checkOwnership(
  tableName: string,
  options: { allowAdmins?: boolean },
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      next();
      return;
    }

    const user = (req as any).user;

    if (!user) {
      res.status(403).json({
        message: "access denied",
      });
      return;
    }

    if (options.allowAdmins && user.role === "admin") {
      next();
      return;
    }

    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id = $1 AND created_by = $2`,
      [id, user.id],
    );
    const item = result.rows[0];

    if (!item) {
      res.status(404).json({
        message: "not found",
      });
      return;
    }

    // we may attach item to request here to avoid to re-query the db later
    next();
  };
}
