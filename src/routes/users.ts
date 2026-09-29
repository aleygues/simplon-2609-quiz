import express from "express";
import { createUser } from "../controllers/users";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../schemas/users";

export const usersRouter = express.Router();

usersRouter.post("/", validate(createUserSchema), createUser);
