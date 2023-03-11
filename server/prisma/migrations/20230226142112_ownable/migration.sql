-- AlterTable
ALTER TABLE "open_foods" ADD COLUMN     "ownable" BOOLEAN DEFAULT true,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "packaged_foods" ADD COLUMN     "ownable" BOOLEAN DEFAULT true,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;
