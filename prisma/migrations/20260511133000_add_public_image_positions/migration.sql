ALTER TABLE "Episode"
  ADD COLUMN "thumbnailPositionX" TEXT NOT NULL DEFAULT 'center',
  ADD COLUMN "thumbnailPositionY" TEXT NOT NULL DEFAULT 'center';

ALTER TABLE "Guest"
  ADD COLUMN "profilePositionX" TEXT NOT NULL DEFAULT 'center',
  ADD COLUMN "profilePositionY" TEXT NOT NULL DEFAULT 'center';

ALTER TABLE "Product"
  ADD COLUMN "photoPositionX" TEXT NOT NULL DEFAULT 'center',
  ADD COLUMN "photoPositionY" TEXT NOT NULL DEFAULT 'center';

ALTER TABLE "Event"
  ADD COLUMN "imagePositionX" TEXT NOT NULL DEFAULT 'center',
  ADD COLUMN "imagePositionY" TEXT NOT NULL DEFAULT 'center';
