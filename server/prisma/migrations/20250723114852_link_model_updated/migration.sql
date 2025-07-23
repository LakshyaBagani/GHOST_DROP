/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "tokenId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Link_token_key" ON "Link"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Link_tokenId_key" ON "Link"("tokenId");
