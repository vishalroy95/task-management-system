import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs("database", () => ({
  uri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ag_assignment",
  useMemoryMongo: process.env.MONGODB_USE_MEMORY === "true",
}));
