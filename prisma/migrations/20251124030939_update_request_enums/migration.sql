/*
  Warnings:

  - The values [NORMAL,URGENT] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANUAL_PICKUP,HAZARDOUS_WASTE] on the enum `RequestType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Request" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
ALTER TABLE "Request" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestType_new" AS ENUM ('COLLECTION', 'MAINTENANCE', 'REPAIR', 'COMPLAINT');
ALTER TABLE "Request" ALTER COLUMN "type" TYPE "RequestType_new" USING ("type"::text::"RequestType_new");
ALTER TYPE "RequestType" RENAME TO "RequestType_old";
ALTER TYPE "RequestType_new" RENAME TO "RequestType";
DROP TYPE "RequestType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';
