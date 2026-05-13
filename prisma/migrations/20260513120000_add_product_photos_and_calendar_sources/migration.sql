ALTER TABLE "Product"
ADD COLUMN "photoUrls" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "Event"
ADD COLUMN "sourceName" TEXT,
ADD COLUMN "sourceLogoUrl" TEXT,
ADD COLUMN "sourceCalendarUrl" TEXT;

CREATE TABLE "CalendarSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "calendarIdOrUrl" TEXT NOT NULL,
  "logoUrl" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CalendarSource_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CalendarSource_isVisible_order_idx" ON "CalendarSource"("isVisible", "order");
