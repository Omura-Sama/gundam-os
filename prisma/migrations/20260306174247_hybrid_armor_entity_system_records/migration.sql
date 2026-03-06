-- CreateTable
CREATE TABLE `core_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'STAFF',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `core_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_records` (
    `id` VARCHAR(191) NOT NULL,
    `moduleName` VARCHAR(191) NOT NULL,
    `recordType` VARCHAR(191) NOT NULL,
    `ownerId` INTEGER NULL,
    `payload` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `system_records_moduleName_recordType_idx`(`moduleName`, `recordType`),
    INDEX `system_records_ownerId_idx`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `system_records` ADD CONSTRAINT `system_records_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `core_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
