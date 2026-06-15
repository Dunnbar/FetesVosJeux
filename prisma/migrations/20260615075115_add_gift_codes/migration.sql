-- AlterTable
ALTER TABLE "Scratch" ADD COLUMN     "giftCode" TEXT;

-- CreateTable
CREATE TABLE "PromoCode" (
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "usedByScratchCode" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("code")
);
