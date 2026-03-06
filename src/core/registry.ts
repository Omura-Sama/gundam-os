import { GundamModule } from './types';
import { BeamRifleModule } from '../modules/beam-rifle';

// Daftar semua Striker Packs yang akan di-load oleh Core Kernel
export const ModuleRegistry: GundamModule[] = [
    BeamRifleModule,
    // ShieldModule, dll akan ditambahkan di sini nantinya
];
