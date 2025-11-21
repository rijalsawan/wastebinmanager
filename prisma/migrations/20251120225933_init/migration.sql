-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PLASTIC', 'PAPER', 'METAL', 'ORGANIC', 'GLASS', 'EWASTE');

-- CreateEnum
CREATE TYPE "BinStatus" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('MANUAL_PICKUP', 'MAINTENANCE', 'HAZARDOUS_WASTE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bin" (
    "id" TEXT NOT NULL,
    "binId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "currentLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "BinStatus" NOT NULL DEFAULT 'LOW',
    "lastEmptied" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "binId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wasteCollected" DOUBLE PRECISION NOT NULL,
    "categoryData" JSONB NOT NULL,
    "peakHours" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bin_binId_key" ON "Bin"("binId");

-- CreateIndex
CREATE INDEX "Report_date_idx" ON "Report"("date");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
