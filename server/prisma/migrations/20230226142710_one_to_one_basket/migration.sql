/*
  Warnings:

  - A unique constraint covering the columns `[neederUserId]` on the table `baskets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "baskets_neederUserId_key" ON "baskets"("neederUserId");
