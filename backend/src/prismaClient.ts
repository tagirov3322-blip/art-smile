import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import type { PrismaClient } from "./generated/prisma/client";

let _prisma: PrismaClient | null = null;

export function initPrisma() {
  if (_prisma) return _prisma;

  // Dynamic import workaround for generated client
  const { PrismaClient } = require("./generated/prisma/client");

  const pool = new pg.Pool({
    host: "aws-1-eu-central-1.pooler.supabase.com",
    port: 5432,
    database: "postgres",
    user: "postgres.uxtsjmshhujeuwbdntek",
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);
  _prisma = new PrismaClient({ adapter });
  return _prisma;
}

// Для обратной совместимости — default export с getter
const handler: ProxyHandler<object> = {
  get(_, prop) {
    return (initPrisma() as any)[prop as string];
  },
};

export default new Proxy({} as PrismaClient, handler) as PrismaClient;
