/*
  Warnings:

  - Added the required column `type` to the `FollowUp` table without a default value. This is not possible if the table is not empty.
  - Made the column `nextFollowup` on table `FollowUp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FollowUp" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "nextFollowup" SET NOT NULL;
