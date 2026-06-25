ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "showHomePopup" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "homePopupTitle" TEXT DEFAULT '¡Ayúdanos a elegir nuestra mascota!';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "homePopupBody" TEXT DEFAULT 'Estamos buscando a la mascota que mejor represente los valores, la identidad y la esencia de Ingeniería Industrial.

Conoce las propuestas, elige tu favorita y sé parte de esta importante decisión.';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "homePopupButtonLabel" TEXT DEFAULT 'Vota aquí';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "homePopupButtonHref" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "homePopupVideoUrl" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "homePopupPlacement" TEXT NOT NULL DEFAULT 'center';
