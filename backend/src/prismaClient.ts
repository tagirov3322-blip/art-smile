import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let _prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!_prisma) {
    const pool = new pg.Pool({
      host: "aws-0-eu-central-1.pooler.supabase.com",
      port: 5432,
      database: "postgres",
      user: "postgres.uxtsjmshhujeuwbdntek",
      password: process.env.DB_PASSWORD || "",
      ssl: { rejectUnauthorized: false },
    });

    const adapter = new PrismaPg(pool);
    _prisma = new PrismaClient({ adapter });
  }
  return _prisma;
}

// Proxy для ленивой инициализации
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as Record<string | symbol, unknown>)[prop];
  },
});

export default prisma;
