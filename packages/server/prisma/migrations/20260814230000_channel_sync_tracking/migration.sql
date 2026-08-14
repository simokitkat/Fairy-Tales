/*
  Warnings:
  - A unique constraint covering the columns `[handle]` on the table `channels` will be added. If there are existing duplicate values, the migration will fail.
*/

-- AlterTable
ALTER TABLE "channels" ADD COLUMN "lastSyncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "channels_handle_key" ON "channels"("handle");
