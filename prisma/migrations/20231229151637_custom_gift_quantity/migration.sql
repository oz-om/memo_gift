-- AlterTable
ALTER TABLE `custom_gift_incudes` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX `customGiftIncudes_customGift_id_fkey` ON `custom_gift_incudes`(`item_id`, `customGift_id`);
