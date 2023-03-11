-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "name" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "giver_users" ADD COLUMN     "firstName" TEXT DEFAULT '',
ADD COLUMN     "lastName" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "needer_users" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT DEFAULT '',
ADD COLUMN     "lastName" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "restaurant_users" ADD COLUMN     "name" TEXT DEFAULT '';
