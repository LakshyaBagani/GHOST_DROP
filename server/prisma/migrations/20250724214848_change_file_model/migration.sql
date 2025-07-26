/*
  Warnings:

  - A unique constraint covering the columns `[iv]` on the table `Files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Files_iv_key" ON "Files"("iv");
