-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING_REVIEW', 'CONVERTED', 'DISCARDED');

-- CreateTable
CREATE TABLE "SheetVisitImport" (
    "id" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "visitDate" TIMESTAMP(3) NOT NULL,
    "sheetSpaceName" TEXT NOT NULL,
    "sheetArrondissement" TEXT,
    "sheetClient" TEXT,
    "sheetSalesCode" TEXT NOT NULL,
    "sheetBroker" TEXT,
    "sheetVisitType" TEXT,
    "sheetRowNumber" INTEGER,
    "rawNotes" TEXT NOT NULL,
    "formattedReport" TEXT,
    "createdById" TEXT,
    "convertedVisitId" TEXT,
    "convertedAt" TIMESTAMP(3),
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SheetVisitImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SheetVisitImport_convertedVisitId_key" ON "SheetVisitImport"("convertedVisitId");

-- CreateIndex
CREATE INDEX "SheetVisitImport_status_importedAt_idx" ON "SheetVisitImport"("status", "importedAt");

-- AddForeignKey
ALTER TABLE "SheetVisitImport" ADD CONSTRAINT "SheetVisitImport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetVisitImport" ADD CONSTRAINT "SheetVisitImport_convertedVisitId_fkey" FOREIGN KEY ("convertedVisitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
