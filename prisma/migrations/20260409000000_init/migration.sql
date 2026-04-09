-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'BIZDEV', 'ADMIN');

-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('RECEIVED', 'STUDY_IN_PROGRESS', 'STUDY_DELIVERED', 'MARKETING', 'IN_DISCUSSION', 'CONTRACT_SIGNED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VisitReportStatus" AS ENUM ('DRAFT', 'FORMATTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "CommercializationReportStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('VISIT_REPORT_PUBLISHED', 'MONTHLY_REPORT_PUBLISHED', 'PROFITABILITY_STUDY_READY', 'STATUS_CHANGED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OWNER',
    "company" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "floor" TEXT,
    "area" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "spaceType" TEXT NOT NULL,
    "amenities" TEXT[],
    "monthlyRent" INTEGER NOT NULL,
    "monthlyCharges" INTEGER,
    "availabilityDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "worksStatus" TEXT,
    "internalNotes" TEXT,
    "status" "SpaceStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpacePhoto" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpacePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfitabilityStudy" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfitabilityStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "prospectCompany" TEXT,
    "prospectContact" TEXT,
    "attendees" TEXT,
    "rawNotes" TEXT NOT NULL,
    "formattedReport" TEXT,
    "status" "VisitReportStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingInvestment" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "description" TEXT,
    "spentAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercializationReport" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "visitsCount" INTEGER NOT NULL DEFAULT 0,
    "inquiriesCount" INTEGER NOT NULL DEFAULT 0,
    "marketingSpend" INTEGER NOT NULL DEFAULT 0,
    "occupancyRate" INTEGER,
    "bizdevComment" TEXT,
    "status" "CommercializationReportStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommercializationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Space_ownerId_idx" ON "Space"("ownerId");

-- CreateIndex
CREATE INDEX "Space_status_idx" ON "Space"("status");

-- CreateIndex
CREATE INDEX "SpacePhoto_spaceId_idx" ON "SpacePhoto"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfitabilityStudy_spaceId_key" ON "ProfitabilityStudy"("spaceId");

-- CreateIndex
CREATE INDEX "Visit_spaceId_visitDate_idx" ON "Visit"("spaceId", "visitDate");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- CreateIndex
CREATE INDEX "MarketingInvestment_spaceId_spentAt_idx" ON "MarketingInvestment"("spaceId", "spentAt");

-- CreateIndex
CREATE INDEX "CommercializationReport_spaceId_idx" ON "CommercializationReport"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercializationReport_spaceId_month_key" ON "CommercializationReport"("spaceId", "month");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpacePhoto" ADD CONSTRAINT "SpacePhoto_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitabilityStudy" ADD CONSTRAINT "ProfitabilityStudy_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitabilityStudy" ADD CONSTRAINT "ProfitabilityStudy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingInvestment" ADD CONSTRAINT "MarketingInvestment_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingInvestment" ADD CONSTRAINT "MarketingInvestment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercializationReport" ADD CONSTRAINT "CommercializationReport_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercializationReport" ADD CONSTRAINT "CommercializationReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

