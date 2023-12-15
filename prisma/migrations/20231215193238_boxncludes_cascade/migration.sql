-- DropForeignKey
ALTER TABLE `includes` DROP FOREIGN KEY `includes_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `includes` DROP FOREIGN KEY `includes_premade_id_fkey`;

-- AddForeignKey
ALTER TABLE `includes` ADD CONSTRAINT `includes_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `includes` ADD CONSTRAINT `includes_premade_id_fkey` FOREIGN KEY (`premade_id`) REFERENCES `premade_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
