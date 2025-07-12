-- DropForeignKey
ALTER TABLE "cost_centers" DROP CONSTRAINT "cost_centers_created_by_fkey";

-- DropForeignKey
ALTER TABLE "cost_centers" DROP CONSTRAINT "cost_centers_deleted_by_fkey";

-- DropForeignKey
ALTER TABLE "cost_centers" DROP CONSTRAINT "cost_centers_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "expense_categories" DROP CONSTRAINT "expense_categories_created_by_fkey";

-- DropForeignKey
ALTER TABLE "expense_categories" DROP CONSTRAINT "expense_categories_deleted_by_fkey";

-- DropForeignKey
ALTER TABLE "expense_categories" DROP CONSTRAINT "expense_categories_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_created_by_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_deleted_by_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_created_by_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_deleted_by_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_updated_by_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roleId" TEXT;

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "company_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
