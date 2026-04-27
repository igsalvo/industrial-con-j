-- AlterTable
ALTER TABLE "public"."Episode"
ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Guest"
ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Sponsor"
ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;
