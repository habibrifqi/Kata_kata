import { defineConfig } from "prisma/config";
import "dotenv/config";

// Prisma v7 config file
// Connection URLs dipisah dari schema.prisma ke sini
// See: https://pris.ly/d/config-datasource

export default defineConfig({
  datasource: {
    // Pooled URL (via pgBouncer) - untuk runtime aplikasi & prisma migrate
    url: process.env.DATABASE_URL!,
  },
});
