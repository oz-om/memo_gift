-- DropForeignKey
ALTER TABLE `boxcategory` DROP FOREIGN KEY `boxCategory_cat_name_fkey`;

-- DropForeignKey
ALTER TABLE `boxcategory` DROP FOREIGN KEY `boxCategory_premade_id_fkey`;

-- AddForeignKey
ALTER TABLE `boxCategory` ADD CONSTRAINT `boxCategory_cat_name_fkey` FOREIGN KEY (`cat_name`) REFERENCES `categories`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boxCategory` ADD CONSTRAINT `boxCategory_premade_id_fkey` FOREIGN KEY (`premade_id`) REFERENCES `premade_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
