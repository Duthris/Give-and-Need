-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'onTheWay', 'inBox', 'takenFromBox', 'completed');

-- CreateTable
CREATE TABLE "restaurant_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT DEFAULT 'https://res.cloudinary.com/dzqkqzjxw/image/upload/v1622021008/restaurant-user-default-image.png',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "address" VARCHAR(255) DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "restaurant_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "giver_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT DEFAULT 'https://res.cloudinary.com/dzqkqzjxw/image/upload/v1622021008/giver-user-default-image.png',
    "phone" TEXT,
    "birthday" TIMESTAMP(3),
    "address" VARCHAR(255) DEFAULT '',
    "verified" BOOLEAN DEFAULT false,
    "verificationCode" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "giver_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "needer_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT DEFAULT 'https://res.cloudinary.com/dzqkqzjxw/image/upload/v1622021008/needer-user-default-image.png',
    "phone" TEXT,
    "dailyNeedQuota" INTEGER DEFAULT 3,
    "verified" BOOLEAN DEFAULT false,
    "verificationCode" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "needer_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packaged_foods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT DEFAULT 'https://res.cloudinary.com/dzqkqzjxw/image/upload/v1622021008/packaged-food-default-image.png',
    "quantity" INTEGER NOT NULL,
    "description" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "giverUserId" INTEGER NOT NULL,

    CONSTRAINT "packaged_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_foods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT DEFAULT 'https://res.cloudinary.com/dzqkqzjxw/image/upload/v1622021008/open-food-default-image.png',
    "quantity" INTEGER NOT NULL,
    "description" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "restaurantUserId" INTEGER NOT NULL,

    CONSTRAINT "open_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" SERIAL NOT NULL,
    "status" "DonationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "neederUserId" INTEGER NOT NULL,
    "openFoodId" INTEGER,
    "packagedFoodId" INTEGER,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baskets" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "neederUserId" INTEGER NOT NULL,
    "openFoodId" INTEGER,
    "packagedFoodId" INTEGER,

    CONSTRAINT "baskets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "rating" SMALLINT NOT NULL DEFAULT 0,
    "donationId" INTEGER NOT NULL,
    "restaurantUserId" INTEGER,
    "giverUserId" INTEGER,
    "neederUserId" INTEGER,
    "review" TEXT DEFAULT '',

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "zip" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "neederUserId" INTEGER NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_boxes" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "packagedFoodId" INTEGER,
    "neederUserId" INTEGER,
    "giverUserId" INTEGER,
    "donationId" INTEGER,

    CONSTRAINT "food_boxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_users_email_key" ON "restaurant_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_users_phone_key" ON "restaurant_users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "giver_users_email_key" ON "giver_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "giver_users_phone_key" ON "giver_users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "giver_users_verificationCode_key" ON "giver_users"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "needer_users_email_key" ON "needer_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "needer_users_phone_key" ON "needer_users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "needer_users_verificationCode_key" ON "needer_users"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_name_key" ON "addresses"("name");

-- AddForeignKey
ALTER TABLE "packaged_foods" ADD CONSTRAINT "packaged_foods_giverUserId_fkey" FOREIGN KEY ("giverUserId") REFERENCES "giver_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_foods" ADD CONSTRAINT "open_foods_restaurantUserId_fkey" FOREIGN KEY ("restaurantUserId") REFERENCES "restaurant_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_openFoodId_fkey" FOREIGN KEY ("openFoodId") REFERENCES "open_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_packagedFoodId_fkey" FOREIGN KEY ("packagedFoodId") REFERENCES "packaged_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baskets" ADD CONSTRAINT "baskets_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baskets" ADD CONSTRAINT "baskets_openFoodId_fkey" FOREIGN KEY ("openFoodId") REFERENCES "open_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baskets" ADD CONSTRAINT "baskets_packagedFoodId_fkey" FOREIGN KEY ("packagedFoodId") REFERENCES "packaged_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_restaurantUserId_fkey" FOREIGN KEY ("restaurantUserId") REFERENCES "restaurant_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_giverUserId_fkey" FOREIGN KEY ("giverUserId") REFERENCES "giver_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_boxes" ADD CONSTRAINT "food_boxes_packagedFoodId_fkey" FOREIGN KEY ("packagedFoodId") REFERENCES "packaged_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_boxes" ADD CONSTRAINT "food_boxes_neederUserId_fkey" FOREIGN KEY ("neederUserId") REFERENCES "needer_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_boxes" ADD CONSTRAINT "food_boxes_giverUserId_fkey" FOREIGN KEY ("giverUserId") REFERENCES "giver_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_boxes" ADD CONSTRAINT "food_boxes_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
