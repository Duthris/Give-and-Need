-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "donationId" INTEGER;

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "addressId" INTEGER;
