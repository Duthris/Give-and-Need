/*
  Warnings:

  - Added the required column `name` to the `food_boxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_boxes" ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
