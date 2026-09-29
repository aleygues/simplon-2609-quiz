import express from "express";
import { quizzesRouter } from "./routes/quizzes";
import { setupDb } from "./db";
import { usersRouter } from "./routes/users";

const port = process.env.PORT || 3301;

async function main() {
  await setupDb();

  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use(express.json());
  app.use("/api/users", usersRouter);
  app.use("/api/quizzes", quizzesRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "not found" });
  });

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

main();
