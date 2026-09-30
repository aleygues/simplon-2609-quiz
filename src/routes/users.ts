import express from "express";
import { createToken, createUser } from "../controllers/users";
import { validate } from "../middlewares/validate";
import { createTokenSchema, createUserSchema } from "../schemas/users";

export const usersRouter = express.Router();

usersRouter.post("/", validate(createUserSchema), createUser);
usersRouter.post("/tokens", validate(createTokenSchema), createToken);
