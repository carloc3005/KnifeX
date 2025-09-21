/*
  Warnings:

  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."users_googleId_key";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "googleId",
ALTER COLUMN "password" SET NOT NULL;
