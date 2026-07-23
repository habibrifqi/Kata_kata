/*
  Warnings:

  - You are about to drop the column `author` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `avatarGradient` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `avatarInitials` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `quotes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quotes" DROP COLUMN "author",
DROP COLUMN "avatarGradient",
DROP COLUMN "avatarInitials",
DROP COLUMN "role";
