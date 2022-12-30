/*
  Warnings:

  - You are about to drop the column `avarar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avarar",
ADD COLUMN     "avatar" TEXT;
