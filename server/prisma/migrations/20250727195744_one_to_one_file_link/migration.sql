/*
  Warnings:

  - A unique constraint covering the columns `[linkId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `linkId` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "linkId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Files_linkId_key" ON "Files"("linkId");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
