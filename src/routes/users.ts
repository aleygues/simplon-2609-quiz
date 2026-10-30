import express from "express";
import {
  createToken,
  createUser,
  getMe,
  deleteToken,
} from "../controllers/users";
import { validate } from "../middlewares/validate";
import { createTokenSchema, createUserSchema } from "../schemas/users";
import { checkUser } from "../middlewares/checkUser";

export const usersRouter = express.Router();

usersRouter.get("/me", checkUser(["admin", "contributor", "user"]), getMe);
usersRouter.post("/", validate(createUserSchema), createUser);
usersRouter.post("/tokens", validate(createTokenSchema), createToken);
usersRouter.delete("/tokens", deleteToken);
