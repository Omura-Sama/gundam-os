import { Express } from 'express';
import { GundamModule } from '../../core/types';

export const InventoryModule: GundamModule = {
    name: "Warehouse (Ammunition & Supply Logistics)",
    version: "1.0.0",
    description: "Melacak sisa peluru (stok barak), amunisi, dan rantai pasok. Jika peluru habis, Gundam tidak bisa menyerang.",
    category: "Logistics",
    weight: "Heavy",
    installMessage: "Ammunition Supply Route Connected.",
    install: (app: Express) => {
        console.log("[Inventory] Ammunition Supply Route connection verified.");
    }
};
