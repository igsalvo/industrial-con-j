ALTER TABLE "NewsItem"
ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "NewsItem_isVisible_isPinned_publishedAt_idx" ON "NewsItem"("isVisible", "isPinned", "publishedAt");
