-- AlterTable
ALTER TABLE "Scratch" ADD COLUMN     "groupId" TEXT;

-- CreateIndex
CREATE INDEX "Scratch_groupId_idx" ON "Scratch"("groupId");
