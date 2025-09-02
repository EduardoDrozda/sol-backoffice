-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "company_id" TEXT;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
