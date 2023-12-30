/*
  Warnings:

  - You are about to drop the column `order_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `empty_card` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `post_card` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `with_note` on the `cosutom_gifts` table. All the data in the column will be lost.
  - You are about to drop the column `custom_gift_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `from_to` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_state` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_type` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `post_card_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `premade_gift_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `cart_item` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `cosutom_gifts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_status` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `cosutom_gifts` DROP FOREIGN KEY `cosutom_gifts_post_card_fkey`;

-- DropForeignKey
ALTER TABLE `cosutom_gifts` DROP FOREIGN KEY `cosutom_gifts_variant_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_post_card_id_fkey`;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `order_id`,
    ADD COLUMN `cart_item` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `cosutom_gifts` DROP COLUMN `empty_card`,
    DROP COLUMN `from`,
    DROP COLUMN `note`,
    DROP COLUMN `post_card`,
    DROP COLUMN `quantity`,
    DROP COLUMN `to`,
    DROP COLUMN `with_note`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `custom_gift_id`,
    DROP COLUMN `from_to`,
    DROP COLUMN `item_id`,
    DROP COLUMN `order_state`,
    DROP COLUMN `order_type`,
    DROP COLUMN `post_card_id`,
    DROP COLUMN `premade_gift_id`,
    ADD COLUMN `order_status` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` VARCHAR(191) NOT NULL,
    `premad_id` VARCHAR(191) NULL,
    `custom_gift_id` VARCHAR(191) NULL,
    `item_id` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `with_note` BOOLEAN NOT NULL DEFAULT true,
    `empty_card` BOOLEAN NOT NULL DEFAULT false,
    `post_card` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cosutom_gifts` ADD CONSTRAINT `cosutom_gifts_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_premad_id_fkey` FOREIGN KEY (`premad_id`) REFERENCES `premade_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_custom_gift_id_fkey` FOREIGN KEY (`custom_gift_id`) REFERENCES `cosutom_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_post_card_fkey` FOREIGN KEY (`post_card`) REFERENCES `postcards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_cart_item_fkey` FOREIGN KEY (`cart_item`) REFERENCES `cart_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `cart_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
