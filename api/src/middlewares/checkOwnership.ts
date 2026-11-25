import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Repository } from "typeorm";
import { AppDataSource } from "../datasource";

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

    const repository = AppDataSource.getRepository(tableName) as Repository<any>;
    const item = await repository.findOneBy({
      id: new ObjectId(id as string),
      createdBy: { id: user.id },
    });

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
