-- AlterTable
ALTER TABLE "User" ADD COLUMN "location" TEXT;
ALTER TABLE "User" ADD COLUMN "preferences" JSONB;
ALTER TABLE "User" ADD COLUMN "socialLinks" JSONB;
ALTER TABLE "User" ADD COLUMN "website" TEXT;
