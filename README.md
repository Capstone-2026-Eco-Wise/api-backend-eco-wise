<div align="center">
  <h1>🌱 Eco Wise API Backend</h1>
  <p><i>Solusi Cerdas untuk Pengelolaan dan Klasifikasi Sampah Berbasis AI</i></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-REST%20API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

Backend REST API untuk aplikasi **Eco Wise**. Proyek ini menangani autentikasi pengguna, manajemen data sampah, pemindaian cerdas (*scan history*) menggunakan integrasi AI, pemberian poin untuk aktivitas pengguna, sistem FAQ, statistik dashboard, serta optimasi *caching* dengan Redis.

## 📑 Daftar Isi
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Teknologi](#️-teknologi)
- [📂 Struktur Proyek](#-struktur-proyek)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [📜 Scripts](#-scripts)
- [🐳 Docker](#-docker)
- [📖 Dokumentasi API](#-dokumentasi-api)
- [🧩 Modul Utama](#-modul-utama)

---

## ✨ Fitur Utama

- 🔐 **Autentikasi Aman:** Terintegrasi dengan Supabase untuk manajemen pengguna.
- 👥 **Role-Based Access Control (RBAC):** Memisahkan hak akses untuk `admin` dan `user`.
- 🧑‍💻 **Manajemen Profil:** Mendukung avatar pengguna dan penanganan sesi (*session handling*).
- ♻️ **Manajemen Kategori Sampah:** Pengelolaan data sampah yang komprehensif.
- 🎯 **Tugas Harian (Daily Tasks):** Sistem misi harian untuk mendorong partisipasi pengguna.
- 🤖 **Klasifikasi AI:** Menyimpan riwayat pindaian (*scan history*) yang diintegrasikan dengan AI Classifier.
- 🏆 **Sistem Poin (Eco Points):** *Streak tracking* dan poin keberlanjutan untuk *gamification*.
- 📊 **Dashboard & Statistik:** Analitik lengkap untuk admin.
- ⚡ **Performa Tinggi:** Menggunakan Redis caching untuk data dengan lalu lintas baca yang tinggi.

---

## 🛠️ Teknologi

- **Framework:** Express.js 5
- **ORM:** Prisma (PostgreSQL)
- **BaaS:** Supabase (Auth & Storage)
- **Caching:** Redis
- **Validasi:** Zod
- **Bahasa:** TypeScript

---

## 📂 Struktur Proyek

```text
src/
├── app.ts            # Konfigurasi aplikasi
├── server.ts         # Entry point server
├── middlewares/      # Interceptors & validasi
├── modules/          # Business logic & features
├── infrastructure/   # Database & eksternal service setup
├── services/         # Layanan eksternal (AI, Storage)
├── routes/           # Definisi endpoint API
├── utils/            # Fungsi utilitas bantuan
└── validations/      # Skema validasi Zod
prisma/
├── schema.prisma     # Skema database
└── migrations/       # Riwayat migrasi
docs/
└── api-docs/         # File Markdown dokumentasi API
```

---

## 🚀 Quick Start

### 1. Kebutuhan Sistem
Pastikan lingkungan berikut telah terpasang:
- **Node.js** (v20 atau terbaru)
- **PostgreSQL**
- **Redis**
- **Supabase Project**
- **AI Service Endpoint**

### 2. Instalasi & Menjalankan Server

Kloning repositori dan jalankan perintah berikut:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Jalankan migrasi database
npm run db:migrate:dev

# 4. Jalankan server (Mode Development)
npm run dev
```

> **Catatan:** Server akan berjalan secara default pada `http://localhost:3000`.

---

## ⚙️ Environment Variables

Salin file `.env.example` ke `.env` dan sesuaikan nilainya. 
**PENTING: Jangan pernah membagikan atau mengunggah nilai asli `.env` Anda ke repositori publik!**

```env
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
ORIGIN_ALLOWED=<url-frontend-anda>

# Redis Configuration
REDIS_URL=<redis-connection-string>
REDIS_DATABASE=<angka-database-redis>

# Database Configuration (PostgreSQL)
DATABASE_URL=<database-connection-url>
DIRECT_URL=<database-direct-connection-url>

# Supabase Configuration
SUPABASE_URL=<supabase-project-url>
SUPABASE_ANON_KEY=<supabase-anon-key>

# AI Service Configuration
AI_API_URL=<ai-service-endpoint-url>
```

---

## 📜 Scripts

Tabel di bawah berisi daftar *command* yang tersedia pada proyek ini:

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pada mode development (Nodemon + TSX) |
| `npm run build` | Mengompilasi TypeScript ke dalam folder `dist` |
| `npm run start` | Menjalankan hasil *build* production |
| `npm run lint` | Melakukan pengecekan tipe dan proses ESLint |
| `npm run db:generate` | Men-generate klien Prisma |
| `npm run db:push` | Mendorong skema ke database secara langsung |
| `npm run db:migrate:dev` | Membuat dan menjalankan file migrasi development |
| `npm run db:migrate:reset` | Mereset ulang data dan migrasi database |
| `npm run db:studio` | Membuka antarmuka grafis database via Prisma Studio |

---

## 🐳 Docker

Proyek ini telah dikonfigurasi menggunakan `docker-compose.yaml` untuk mempermudah menjalankan API dan Redis secara bersamaan di dalam kontainer.

Jalankan perintah berikut:
```bash
docker compose up --build
```

---

## 📖 Dokumentasi API

> **API Base Path:** Seluruh endpoint berada di bawah `/api`.
> **Health Check:** Lakukan `GET /` untuk memastikan server berjalan normal.

Dokumentasi detail tiap endpoint tersedia pada direktori `docs/api-docs`:

- 🔐 [`auth-api.md`](docs/api-docs/auth-api.md)
- 👤 [`user-api.md`](docs/api-docs/user-api.md)
- 🗑️ [`waste-categories-api.md`](docs/api-docs/waste-categories-api.md)
- ❓ [`faqs-api.md`](docs/api-docs/faqs-api.md)
- ✅ [`daily-tasks-api.md`](docs/api-docs/daily-tasks-api.md)
- 🌟 [`eco-points-api.md`](docs/api-docs/eco-points-api.md)
- 📷 [`scan-history-api.md`](docs/api-docs/scan-history-api.md)
- 🎯 [`user-task-completions-api.md`](docs/api-docs/user-task-completions-api.md)
- 📈 [`statistics-api.md`](docs/api-docs/statistics-api.md)
- 🩺 [`health-api.md`](docs/api-docs/health-api.md)

---

## 🧩 Modul Utama

Arsitektur logika dibagi menjadi beberapa modul independen:

- **`auth`**: Registrasi, login, logout, dan pembaruan password.
- **`users`**: Manajemen sesi, pembaruan avatar, pengaturan profil, dan *role*.
- **`waste-categories`**: Manajemen master data kategori sampah.
- **`faqs`**: Pengelolaan pertanyaan umum untuk publik maupun admin.
- **`daily-tasks`**: Pengelolaan tugas harian (misal: memilah sampah jenis X).
- **`eco-points`**: Pelacakan aktivitas *streak* mingguan dan papan peringkat (Leaderboard).
- **`scan-history`**: Mengunggah citra (*image upload*) dan merekam hasil prediksi sampah.
- **`user-task-completions`**: Verifikasi penyelesaian tugas berbasis hasil pindaian.
- **`statistics`**: Pembuatan laporan dan data visual untuk dashboard admin.

---

## 📝 Catatan Implementasi

- **Caching:** Redis digunakan secara ekstensif untuk session, FAQ, kategori sampah, eco points, histori pindaian, dan statistik guna mengurangi beban database utama.
- **Autentikasi & Storage:** Mengandalkan integrasi langsung ke ekosistem Supabase.
- **Akses Data:** Menggunakan Prisma sebagai ORM utama karena memberikan jaminan *type-safety*.

---

<div align="center">
  <sub>Dibangun dengan ❤️ oleh Tim Eco Wise</sub>
</div>
