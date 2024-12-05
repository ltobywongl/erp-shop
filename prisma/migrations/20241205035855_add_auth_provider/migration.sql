-- AlterTable
ALTER TABLE `users` ADD COLUMN `provider` VARCHAR(16) NULL,
    MODIFY `password` VARCHAR(100) NULL;
