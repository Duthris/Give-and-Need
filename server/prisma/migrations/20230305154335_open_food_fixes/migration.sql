-- AlterTable
ALTER TABLE "open_foods" ADD COLUMN     "selfPickup" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "packaged_foods" ADD COLUMN     "expirationDate" TIMESTAMP(3);
