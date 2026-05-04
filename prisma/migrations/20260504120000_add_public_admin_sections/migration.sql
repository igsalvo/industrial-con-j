-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN "subject" TEXT,
ADD COLUMN "motive" TEXT;

-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN "showHeroSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showIdentitySection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showHonorSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showProductsSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showParticipationSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "heroImageUrl" TEXT,
ADD COLUMN "heroOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "identitySectionEyebrow" TEXT DEFAULT 'Identidad',
ADD COLUMN "identitySectionTitle" TEXT DEFAULT 'Lo que mueve Industrial con J',
ADD COLUMN "identitySectionDescription" TEXT DEFAULT 'Proposito, vision, mision y valores editables desde el administrador.',
ADD COLUMN "identitySectionOrder" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN "honorSectionEyebrow" TEXT DEFAULT 'Circulo de Honor',
ADD COLUMN "honorSectionTitle" TEXT DEFAULT 'Personas que abren camino',
ADD COLUMN "honorSectionDescription" TEXT DEFAULT 'Reconocimientos y perfiles destacados del ecosistema industrial.',
ADD COLUMN "honorSectionOrder" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN "productsSectionEyebrow" TEXT DEFAULT 'TienDIIta CEIN',
ADD COLUMN "productsSectionTitle" TEXT DEFAULT 'Catalogo simple',
ADD COLUMN "productsSectionDescription" TEXT DEFAULT 'Productos administrables para consultar o reservar sin carrito ni pagos.',
ADD COLUMN "productsSectionOrder" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN "participationSectionEyebrow" TEXT DEFAULT 'Participa',
ADD COLUMN "participationSectionTitle" TEXT DEFAULT 'Donaciones, auspicios y comunidad',
ADD COLUMN "participationSectionDescription" TEXT DEFAULT 'Formas concretas de apoyar, auspiciar o participar.',
ADD COLUMN "participationSectionOrder" INTEGER NOT NULL DEFAULT 9,
ADD COLUMN "contactPageEyebrow" TEXT DEFAULT 'Contacto',
ADD COLUMN "contactPageTitle" TEXT DEFAULT 'Contactanos',
ADD COLUMN "contactPageDescription" TEXT DEFAULT 'Escribenos y revisaremos tu mensaje desde el panel administrador.';

-- CreateTable
CREATE TABLE "IdentityItem" (
  "id" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "icon" TEXT,
  "imageUrl" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IdentityItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorMember" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "photoUrl" TEXT,
  "description" TEXT NOT NULL,
  "role" TEXT,
  "generation" TEXT,
  "externalLinks" JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HonorMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "photoUrl" TEXT,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "stock" INTEGER,
  "ctaText" TEXT,
  "ctaLink" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipationItem" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT,
  "icon" TEXT,
  "type" TEXT NOT NULL,
  "ctaText" TEXT,
  "ctaLink" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ParticipationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IdentityItem_kind_order_idx" ON "IdentityItem"("kind", "order");
CREATE INDEX "IdentityItem_isVisible_order_idx" ON "IdentityItem"("isVisible", "order");
CREATE INDEX "HonorMember_isVisible_order_idx" ON "HonorMember"("isVisible", "order");
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");
CREATE INDEX "ProductCategory_isVisible_order_idx" ON "ProductCategory"("isVisible", "order");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_isVisible_order_idx" ON "Product"("isVisible", "order");
CREATE INDEX "ParticipationItem_type_order_idx" ON "ParticipationItem"("type", "order");
CREATE INDEX "ParticipationItem_isVisible_order_idx" ON "ParticipationItem"("isVisible", "order");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
