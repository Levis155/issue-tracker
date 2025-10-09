-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `Issue_assignedToUserId_fkey`;

-- DropIndex
DROP INDEX `Issue_assignedToUserId_fkey` ON `issue`;

-- AlterTable
ALTER TABLE `issue` MODIFY `assignedToUserId` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Issue` ADD CONSTRAINT `Issue_assignedToUserId_fkey` FOREIGN KEY (`assignedToUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
