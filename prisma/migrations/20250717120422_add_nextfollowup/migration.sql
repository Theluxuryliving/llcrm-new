/*
  Warnings:

  - You are about to drop the column `type` on the `FollowUp` table. All the data in the column will be lost.
  - Made the column `note` on table `FollowUp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FollowUp" DROP COLUMN "type",
ADD COLUMN     "nextFollowup" TIMESTAMP(3),
ALTER COLUMN "note" SET NOT NULL;
