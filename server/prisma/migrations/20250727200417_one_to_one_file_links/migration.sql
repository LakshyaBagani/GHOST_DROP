-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_linkId_fkey";

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "linkId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
