import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Quiz } from "./entities/Quiz";

const DB_NAME = process.env.DB_NAME || "quiz";
const DB_USER = process.env.DB_USER || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "db";
const DB_PORT = Number(process.env.DB_PORT || 27017);
const DB_AUTH_SOURCE = process.env.DB_AUTH_SOURCE || "admin";

const DB_URL = process.env.DB_URL;

export const AppDataSource = new DataSource({
  type: "mongodb",
  ...(DB_URL
    ? { url: DB_URL }
    : {
        host: DB_HOST,
        port: DB_PORT,
        ...(DB_USER
          ? {
              username: DB_USER,
              password: DB_PASSWORD,
              authSource: DB_AUTH_SOURCE,
            }
          : {}),
      }),
  database: DB_NAME,
  // MongoDB is schemaless: synchronize creates the collections and indexes
  // (e.g. the unique index on users.email) and the database on first write,
  // replacing the CREATE TABLE / CREATE DATABASE statements.
  synchronize: true,
  logging: false,
  entities: [User, Quiz],
});

export async function setupDb() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}
