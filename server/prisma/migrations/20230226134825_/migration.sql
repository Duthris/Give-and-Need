/*
  Warnings:

  - You are about to alter the column `name` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_neederUserId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_donationId_fkey";

-- DropIndex
DROP INDEX "addresses_name_key";

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
