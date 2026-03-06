/*
  Warnings:

  - You are about to drop the column `name` on the `core_users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `core_users` table. All the data in the column will be lost.
  - You are about to drop the `system_records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `system_records` DROP FOREIGN KEY `system_records_ownerId_fkey`;

-- AlterTable
ALTER TABLE `core_users` DROP COLUMN `name`,
    DROP COLUMN `role`,
    ADD COLUMN `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `system_records`;

-- CreateTable
CREATE TABLE `mod_hr_employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coreUserId` INTEGER NOT NULL,
    `employeeCode` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `mod_hr_employees_coreUserId_key`(`coreUserId`),
    UNIQUE INDEX `mod_hr_employees_employeeCode_key`(`employeeCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mod_medical_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coreUserId` INTEGER NOT NULL,
    `rmNumber` VARCHAR(191) NOT NULL,
    `bloodType` VARCHAR(191) NULL,

    UNIQUE INDEX `mod_medical_records_coreUserId_key`(`coreUserId`),
    UNIQUE INDEX `mod_medical_records_rmNumber_key`(`rmNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mod_hr_employees` ADD CONSTRAINT `mod_hr_employees_coreUserId_fkey` FOREIGN KEY (`coreUserId`) REFERENCES `core_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mod_medical_records` ADD CONSTRAINT `mod_medical_records_coreUserId_fkey` FOREIGN KEY (`coreUserId`) REFERENCES `core_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
