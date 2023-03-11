-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_neederUserId_fkey";

-- DropForeignKey
ALTER TABLE "open_foods" DROP CONSTRAINT "open_foods_restaurantUserId_fkey";

-- DropForeignKey
ALTER TABLE "packaged_foods" DROP CONSTRAINT "packaged_foods_giverUserId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_donationId_fkey";

-- AddForeignKey
ALTER TABLE "packaged_foods" ADD CONSTRAINT "packaged_foods_giverUserId_fkey" FOREIGN KEY ("giverUserId") REFERENCES "giver_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_foods" ADD CONSTRAINT "open_foods_restaurantUserId_fkey" FOREIGN KEY ("restaurantUserId") REFERENCES "restaurant_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
