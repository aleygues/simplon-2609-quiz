import { z } from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(5).max(255),
});
