/*
  Warnings:

  - Added the required column `cleanTitle` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_fairyTaleId_fkey";

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "cleanTitle" TEXT NOT NULL,
ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "rawPayload" JSONB,
ADD COLUMN     "thumbnailUrl" TEXT,
ALTER COLUMN "fairyTaleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_fairyTaleId_fkey" FOREIGN KEY ("fairyTaleId") REFERENCES "fairy_tales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
