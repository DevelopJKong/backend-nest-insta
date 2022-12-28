/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleData" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avarar" TEXT,
ADD COLUMN     "bio" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "RoleData" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
