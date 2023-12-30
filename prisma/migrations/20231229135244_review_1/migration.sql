/*
  Warnings:

  - You are about to drop the `built_box_includes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `built_boxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_gifts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_type` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `built_box_includes` DROP FOREIGN KEY `built_box_includes_builtBox_id_fkey`;

-- DropForeignKey
ALTER TABLE `built_box_includes` DROP FOREIGN KEY `built_box_includes_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `built_boxes` DROP FOREIGN KEY `built_boxes_post_card_fkey`;

-- DropForeignKey
ALTER TABLE `custom_gift_incudes` DROP FOREIGN KEY `custom_gift_incudes_customGift_id_fkey`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `order_type` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `built_box_includes`;

-- DropTable
DROP TABLE `built_boxes`;

-- DropTable
DROP TABLE `custom_gifts`;

-- CreateTable
CREATE TABLE `cosutom_gift` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `variant_id` VARCHAR(191) NOT NULL,
    `post_card` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `with_note` BOOLEAN NOT NULL DEFAULT true,
    `empty_card` BOOLEAN NOT NULL DEFAULT false,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `variants_name_key` ON `variants`(`name`);

-- AddForeignKey
ALTER TABLE `cosutom_gift` ADD CONSTRAINT `cosutom_gift_post_card_fkey` FOREIGN KEY (`post_card`) REFERENCES `postcards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cosutom_gift` ADD CONSTRAINT `cosutom_gift_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custom_gift_incudes` ADD CONSTRAINT `custom_gift_incudes_customGift_id_fkey` FOREIGN KEY (`customGift_id`) REFERENCES `cosutom_gift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
