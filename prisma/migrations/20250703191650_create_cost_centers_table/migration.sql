-- CreateTable
CREATE TABLE "cost_centers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
