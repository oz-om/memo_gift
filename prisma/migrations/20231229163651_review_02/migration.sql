/*
  Warnings:

  - You are about to drop the `cosutom_gift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cosutom_gift` DROP FOREIGN KEY `cosutom_gift_post_card_fkey`;

-- DropForeignKey
ALTER TABLE `cosutom_gift` DROP FOREIGN KEY `cosutom_gift_variant_id_fkey`;

-- DropForeignKey
ALTER TABLE `custom_gift_incudes` DROP FOREIGN KEY `custom_gift_incudes_customGift_id_fkey`;

-- DropTable
DROP TABLE `cosutom_gift`;

-- CreateTable
CREATE TABLE `cosutom_gifts` (
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

-- AddForeignKey
ALTER TABLE `cosutom_gifts` ADD CONSTRAINT `cosutom_gifts_post_card_fkey` FOREIGN KEY (`post_card`) REFERENCES `postcards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cosutom_gifts` ADD CONSTRAINT `cosutom_gifts_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custom_gift_incudes` ADD CONSTRAINT `custom_gift_incudes_customGift_id_fkey` FOREIGN KEY (`customGift_id`) REFERENCES `cosutom_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
