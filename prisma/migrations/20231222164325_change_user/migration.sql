/*
  Warnings:

  - You are about to drop the column `full_name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `customgiftincudes` DROP FOREIGN KEY `customGiftIncudes_customGift_id_fkey`;

-- DropForeignKey
ALTER TABLE `customgiftincudes` DROP FOREIGN KEY `customGiftIncudes_item_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `full_name`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- AddForeignKey
ALTER TABLE `customGiftIncudes` ADD CONSTRAINT `customGiftIncudes_customGift_id_fkey` FOREIGN KEY (`customGift_id`) REFERENCES `custom_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customGiftIncudes` ADD CONSTRAINT `customGiftIncudes_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
