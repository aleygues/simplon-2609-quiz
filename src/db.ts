import { Pool } from "pg";

const DB_NAME = process.env.DB_NAME || "quiz";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "supersecret";
const DB_HOST = process.env.DB_HOST || "db";
const DB_PORT = Number(process.env.DB_PORT || 5432);

const TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

async function createDatabase() {
  // Connect to the default "postgres" database to be able to create the app database
  const client = new Pool({
    database: "postgres",
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
  });

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [DB_NAME],
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${DB_NAME}`);
  }

  await client.end();
}

export async function initDb(pool: Pool) {
  await pool.query(TABLES_SQL);
}

export const db = new Pool({
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
});

export async function setupDb() {
  await createDatabase();
  await initDb(db);
}
