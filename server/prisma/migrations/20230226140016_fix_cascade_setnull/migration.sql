-- DropForeignKey
ALTER TABLE "baskets" DROP CONSTRAINT "baskets_neederUserId_fkey";

-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_neederUserId_fkey";

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baskets" ADD CONSTRAINT "baskets_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
