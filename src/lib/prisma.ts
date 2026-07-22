import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// Prisma v7: Wajib menggunakan driver adapter
// Menggunakan Neon adapter karena database kita adalah Neon PostgreSQL
// See: https://pris.ly/d/driver-adapters

// WebSocket dibutuhkan oleh Neon serverless driver di Node.js runtime
// (tidak diperlukan di Edge Runtime yang sudah punya WebSocket built-in)
if (typeof WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

// Helper untuk membuat Prisma Client baru dengan Neon adapter
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // PrismaNeon menerima PoolConfig (connection string atau object config)
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// Singleton pattern untuk Next.js (mencegah multiple instances saat hot-reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
