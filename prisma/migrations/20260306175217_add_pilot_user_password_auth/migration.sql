/*
  Warnings:

  - Added the required column `password` to the `core_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `core_users` ADD COLUMN `password` VARCHAR(191) NOT NULL;
