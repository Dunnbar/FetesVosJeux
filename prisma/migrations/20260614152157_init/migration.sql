-- CreateTable
CREATE TABLE "Scratch" (
    "code" TEXT NOT NULL,
    "revealMechanic" TEXT NOT NULL DEFAULT 'scratch',
    "coverImagePath" TEXT NOT NULL,
    "annonceMode" TEXT NOT NULL DEFAULT 'text',
    "annonceImagePath" TEXT,
    "annonceTemplate" TEXT,
    "annonceTitle" TEXT,
    "annonceSubtitle" TEXT,
    "annonceBody" TEXT,
    "buyerName" TEXT,
    "buyerEmail" TEXT,
    "amountCents" INTEGER NOT NULL DEFAULT 500,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "scratchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scratch_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scratch_stripeSessionId_key" ON "Scratch"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Scratch_stripePaymentIntentId_key" ON "Scratch"("stripePaymentIntentId");
