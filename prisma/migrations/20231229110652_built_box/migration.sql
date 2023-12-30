/*
  Warnings:

  - You are about to drop the column `post_car_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_post_car_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `post_car_id`,
    ADD COLUMN `post_card_id` VARCHAR(191) NULL,
    MODIFY `custom_gift_id` VARCHAR(191) NULL,
    MODIFY `item_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `builtBox` (
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

-- CreateTable
CREATE TABLE `built_box_includes` (
    `builtBox_id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,

    INDEX `builtBoxIncludes_builtBox_id_fkey`(`builtBox_id`),
    PRIMARY KEY (`builtBox_id`, `item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `boxCategory_premade_id_fkey` ON `boxCategory`(`premade_id`);

-- CreateIndex
CREATE INDEX `boxVarint_premade_id_fkey` ON `boxVarint`(`premade_id`);

-- CreateIndex
CREATE INDEX `includes_premade_id_fkey` ON `includes`(`premade_id`);

-- CreateIndex
CREATE INDEX `itemCategory_item_id_fkey` ON `itemCategory`(`item_id`);

-- CreateIndex
CREATE INDEX `users_id_fkey` ON `users`(`id`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_post_card_id_fkey` FOREIGN KEY (`post_card_id`) REFERENCES `postcards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `builtBox` ADD CONSTRAINT `builtBox_post_card_fkey` FOREIGN KEY (`post_card`) REFERENCES `postcards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `built_box_includes` ADD CONSTRAINT `built_box_includes_builtBox_id_fkey` FOREIGN KEY (`builtBox_id`) REFERENCES `builtBox`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `built_box_includes` ADD CONSTRAINT `built_box_includes_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
