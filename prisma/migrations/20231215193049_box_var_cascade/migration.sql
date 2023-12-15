-- DropForeignKey
ALTER TABLE `boxvarint` DROP FOREIGN KEY `boxVarint_premade_id_fkey`;

-- DropForeignKey
ALTER TABLE `boxvarint` DROP FOREIGN KEY `boxVarint_variant_id_fkey`;

-- AddForeignKey
ALTER TABLE `boxVarint` ADD CONSTRAINT `boxVarint_premade_id_fkey` FOREIGN KEY (`premade_id`) REFERENCES `premade_gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boxVarint` ADD CONSTRAINT `boxVarint_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
