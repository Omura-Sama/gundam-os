# 🤖 GUNDAM-OS: Modular ERP Framework

![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-green?style=for-the-badge&logo=probot)
![Version](https://img.shields.io/badge/VERSION-1.0.0--ALPHA-red?style=for-the-badge)
![License](https://img.shields.io/badge/LICENSE-MIT-blue?style=for-the-badge)

**GUNDAM-OS** adalah *Base Master* framework sistem informasi berbasis Node.js, Express, dan TypeScript. Dirancang dengan filosofi **Mobile Suit Architecture**, sistem ini memisahkan "Inner Frame" (Core Engine) dari "Striker Packs" (Business Modules). 

Sistem ini diciptakan sebagai fondasi *open-source* yang kokoh, di di mana *core system*-nya bisa digunakan secara gratis, namun sangat fleksibel untuk dikustomisasi menjadi berbagai aplikasi komersial spesifik (seperti sistem *booking*, koperasi, atau ERP *travel*).

---

## 🏗️ The Architecture (Mobile Suit Blueprint)

Gundam-OS bekerja dengan konsep *Plug-and-Play*:

- **The Inner Frame (`/src/core`):** Rangka utama robot. Menangani pemuat modul (*Module Loader*), *routing* dasar, dan nantinya akan mengurus *Auth* serta koneksi *Database*.
- **The Striker Packs (`/src/modules`):** Modul bisnis independen. Pasang modul yang dibutuhkan, dan sistem akan langsung mengenalinya tanpa harus membongkar *Inner Frame*.

### 🎯 Use Case Scenarios (The Loadouts)
Satu *Base Master*, berbagai kemungkinan:
1. **Loadout A (Photography Studio):** Pasang Modul *Appointment* & *Gallery* ➡️ Menjadi sistem *booking* untuk sesi Newborn Photography & 3D Baby Foot Casting.
2. **Loadout B (Travel Agency):** Pasang Modul *Manifest* & *Inventory* ➡️ Menjadi sistem operasional Travel Umroh.
3. **Loadout C (Financial):** Pasang Modul *Ledger* & *Loan Tracking* ➡️ Menjadi sistem manajemen Koperasi.

---

## 🚀 Quick Start (Deployment Sequence)

Nyalakan reaktor dan jalankan *Inner Frame* di mesin lokal Anda:

### 1. Masuk ke Hangar
```bash
git clone https://github.com/USERNAME_GITHUB_KAMU/gundam-os.git
cd gundam-os
```

### 2. Isi Bahan Bakar (Install Dependencies)
```bash
npm install
```

### 3. Power On (Run System)
```bash
npm run dev
```

Sistem akan berjalan di `http://localhost:3000`.
Untuk melihat modul pertama yang sudah aktif, akses endpoint senjata pertama kita: `http://localhost:3000/api/appointment/slots`

---

## 🛠️ How to Build a Module (Crafting New Parts)
Membuat senjata baru sangat mudah. Modul hanya perlu mengikuti kontrak (Interface) dari `GundamModule`:

```typescript
import { Application } from 'express';
import { GundamModule } from '../../core/types';

export const MyNewModule: GundamModule = {
  name: 'Gatling-Gun-Reporting',
  version: '1.0.0',
  init: (app: Application) => {
    app.get('/api/reports', (req, res) => {
      res.json({ status: 'Reporting Module Online!' });
    });
  }
};
```

Daftarkan modul tersebut di `src/main.ts`, dan sistem akan langsung mengintegrasikannya!

---

## 📡 Roadmap (The Project Evolution)
- [x] **Phase 1: RX-78-0** - Stabilisasi Inner Frame & Module Loader.
- [x] **Phase 1.5** - Pemasangan modul pembuktian pertama (Appointment Module).
- [ ] **Phase 2: The Core Block** - Integrasi Database ORM (Prisma/TypeORM) untuk persistensi data cross-module.
- [ ] **Phase 3: Psycoframe** - Sistem Role-Based Access Control (RBAC) dan Autentikasi.

---

Maintained with 💻 & ☕ Prepare for the next sortie! 🚀
