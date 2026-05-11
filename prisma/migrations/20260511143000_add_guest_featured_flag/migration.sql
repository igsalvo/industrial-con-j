ALTER TABLE "Guest"
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Guest_isFeatured_isVisible_idx" ON "Guest"("isFeatured", "isVisible");
