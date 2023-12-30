/*
  Warnings:

  - You are about to drop the `boxcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boxvarint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `builtbox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customgiftincudes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `boxcategory` DROP FOREIGN KEY `boxCategory_cat_name_fkey`;

-- DropForeignKey
ALTER TABLE `boxcategory` DROP FOREIGN KEY `boxCategory_premade_id_fkey`;

-- DropForeignKey
ALTER TABLE `boxvarint` DROP FOREIGN KEY `boxVarint_premade_id_fkey`;

-- DropForeignKey
ALTER TABLE `boxvarint` DROP FOREIGN KEY `boxVarint_variant_id_fkey`;

-- DropForeignKey
ALTER TABLE `built_box_includes` DROP FOREIGN KEY `built_box_includes_builtBox_id_fkey`;

-- DropForeignKey
ALTER TABLE `builtbox` DROP FOREIGN KEY `builtBox_post_card_fkey`;

-- DropForeignKey
ALTER TABLE `customgiftincudes` DROP FOREIGN KEY `customGiftIncudes_customGift_id_fkey`;

-- DropForeignKey
ALTER TABLE `customgiftincudes` DROP FOREIGN KEY `customGiftIncudes_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `itemcategory` DROP FOREIGN KEY `itemCategory_cat_name_fkey`;

-- DropForeignKey
ALTER TABLE `itemcategory` DROP FOREIGN KEY `itemCategory_item_id_fkey`;

-- DropTable
DROP TABLE `boxcategory`;

-- DropTable
DROP TABLE `boxvarint`;

-- DropTable
DROP TABLE `builtbox`;

-- DropTable
DROP TABLE `customgiftincudes`;

-- DropTable
DROP TABLE `itemcategory`;

-- CreateTable
CREATE TABLE `item_categories` (
    `item_id` VARCHAR(191) NOT NULL,
    `cat_name` VARCHAR(191) NOT NULL,

    INDEX `itemCategory_item_id_fkey`(`item_id`),
    PRIMARY KEY (`item_id`, `cat_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `box_variants` (
    `premade_id` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NOT NULL,

    INDEX `boxVarint_premade_id_fkey`(`premade_id`),
    PRIMARY KEY (`premade_id`, `variant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `box_categories` (
    `premade_id` VARCHAR(191) NOT NULL,
    `cat_name` VARCHAR(191) NOT NULL,

    INDEX `boxCategory_premade_id_fkey`(`premade_id`),
    PRIMARY KEY (`premade_id`, `cat_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_gift_incudes` (
    `customGift_id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,

    INDEX `customGiftIncudes_item_id_fkey`(`item_id`),
    PRIMARY KEY (`customGift_id`, `item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `built_boxes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `post_card` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `with_note` BOOLEAN NOT NULL DEFAULT true,
    `empty_card` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `item_categories` ADD CONSTRAINT `item_categories_cat_name_fkey` FOREIGN KEY (`cat_name`) REFERENCES `categories`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_categories` ADD CONSTRAINT `item_categories_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `box_variants` ADD CONSTRAINT `box_variants_premade_id_fkey` FOREIGN KEY (`premade_id`) REFERENCES `premade_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `box_variants` ADD CONSTRAINT `box_variants_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `box_categories` ADD CONSTRAINT `box_categories_cat_name_fkey` FOREIGN KEY (`cat_name`) REFERENCES `categories`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `box_categories` ADD CONSTRAINT `box_categories_premade_id_fkey` FOREIGN KEY (`premade_id`) REFERENCES `premade_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custom_gift_incudes` ADD CONSTRAINT `custom_gift_incudes_customGift_id_fkey` FOREIGN KEY (`customGift_id`) REFERENCES `custom_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custom_gift_incudes` ADD CONSTRAINT `custom_gift_incudes_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `built_boxes` ADD CONSTRAINT `built_boxes_post_card_fkey` FOREIGN KEY (`post_card`) REFERENCES `postcards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `built_box_includes` ADD CONSTRAINT `built_box_includes_builtBox_id_fkey` FOREIGN KEY (`builtBox_id`) REFERENCES `built_boxes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
