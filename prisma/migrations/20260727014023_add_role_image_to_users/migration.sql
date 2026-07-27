-- CreateEnum
CREATE TYPE "Role" AS ENUM ('writer', 'admin', 'superadmin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'writer';
