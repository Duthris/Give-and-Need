-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "neederUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "baskets" ALTER COLUMN "neederUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "neederUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "open_foods" ALTER COLUMN "restaurantUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "packaged_foods" ALTER COLUMN "giverUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ratings" ALTER COLUMN "donationId" DROP NOT NULL;
