-- AlterTable
ALTER TABLE "Bin" ADD COLUMN     "createdBy" TEXT;

-- AddForeignKey
ALTER TABLE "Bin" ADD CONSTRAINT "Bin_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
