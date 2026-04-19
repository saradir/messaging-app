/*
  Warnings:

  - You are about to drop the column `lastSeenId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `lastReadAt` on the `Membership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "lastSeenId";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "lastReadAt",
ADD COLUMN     "lastSeenMessageId" INTEGER;
