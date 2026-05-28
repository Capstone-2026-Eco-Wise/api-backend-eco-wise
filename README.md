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

Backend REST API untuk aplikasi **Eco Wise**. Proyek ini menangani autentikasi pengguna, manajemen data sampah, pemindaian cerdas (_scan history_) menggunakan integrasi AI, pemberian poin untuk aktivitas pengguna, sistem FAQ, statistik dashboard, serta optimasi _caching_ dengan Redis.

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
- 🧑‍💻 **Manajemen Profil:** Mendukung avatar pengguna dan penanganan sesi (_session handling_).
- ♻️ **Manajemen Kategori Sampah:** Pengelolaan data sampah yang komprehensif.
- 🎯 **Tugas Harian (Daily Tasks):** Sistem misi harian untuk mendorong partisipasi pengguna.
- 🤖 **Klasifikasi AI:** Menyimpan riwayat pindaian (_scan history_) yang diintegrasikan dengan AI Classifier.
- 🏆 **Sistem Poin (Eco Points):** _Streak tracking_ dan poin keberlanjutan untuk _gamification_.
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

## 🚀 Quick Start & Instalasi Lokal

### 1. Kebutuhan Sistem

Pastikan lingkungan berikut telah terpasang di komputer lokal Anda:

- **Node.js** (v20 atau terbaru, disarankan v22 LTS)
- **PostgreSQL** (Bisa menggunakan Supabase secara cloud)
- **Redis Server** (Bisa dijalankan langsung atau melalui Docker)

### 2. Instalasi Dependensi

Jalankan perintah berikut di folder root proyek backend:

```bash
npm install
```

_(Atau `npm ci` untuk instalasi yang bersih dan cepat sesuai lockfile)_

### 3. Konfigurasi Environment File

Salin file `.env.example` menjadi `.env` (untuk development lokal) atau `.env.staging` (untuk staging):

```bash
cp .env.example .env
# atau jika ingin membuat environment staging
cp .env.example .env.staging
```

Sesuaikan variabel-variabel di dalamnya dengan kredensial database Supabase, kunci API Supabase, dan Redis Anda.

### 4. Prisma Setup (Sangat Penting)

Lakukan sinkronisasi skema database Prisma ke database target (misal Supabase):

```bash
# Generate Prisma Client lokal
npm run db:generate

# Pindahkan/sinkronisasi skema langsung ke database Supabase
npm run db:push
# (Atau untuk environment staging)
npm run db:push:staging
```

### 5. Menjalankan Server Lokal

- **Mode Development (Lokal)**:
  ```bash
  npm run dev
  ```
- **Mode Staging (Menghubungkan ke DB Supabase Staging)**:
  ```bash
  npm run dev:staging
  ```
  _Server akan menyala dan mendengarkan di `http://localhost:3000`._

---

## ⚙️ Environment Variables

Berikut adalah variabel lingkungan yang diperlukan di dalam file `.env` atau `.env.staging`:

| Variabel              | Deskripsi                                           | Contoh Nilai                                                        |
| :-------------------- | :-------------------------------------------------- | :------------------------------------------------------------------ |
| `PORT`                | Port server backend                                 | `3000`                                                              |
| `HOST`                | Host binding interface                              | `0.0.0.0` atau `localhost`                                          |
| `NODE_ENV`            | Mode aplikasi                                       | `development`, `staging`, atau `production`                         |
| `ORIGIN_ALLOWED`      | URL origin frontend yang diizinkan CORS             | `http://localhost:5173`                                             |
| `REDIS_URL`           | String koneksi Redis                                | `redis://localhost:6379/1`                                          |
| `DATABASE_URL`        | URL PostgreSQL Connection Pooler (Pgbouncer)        | `postgresql://postgres...supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL`          | URL PostgreSQL Direct Connection (Non-pooler)       | `postgresql://postgres...supabase.com:5432/postgres`                |
| `SUPABASE_URL`        | URL Proyek Supabase                                 | `https://fbklbswfmzhbpuqqcmbw.supabase.co`                          |
| `SUPABASE_ANON_KEY`   | Anon Key proyek Supabase                            | `eyJhbGciOiJIUz...`                                                 |
| `SUPABASE_JWT_SECRET` | JWT Secret dari Supabase Auth                       | `BibHEHh/os0S5SI...`                                                |
| `AI_API_URL`          | URL Endpoint REST API Model AI                      | `http://localhost:8000`                                             |
| `ADMIN_SECRET_KEY`    | Kunci rahasia untuk meregistrasi user sebagai Admin | `admin`                                                             |

---

## 📜 Scripts

Perintah npm script yang tersedia di `package.json`:

| Perintah                           | Deskripsi                                                                    |
| :--------------------------------- | :--------------------------------------------------------------------------- |
| `npm run dev`                      | Menjalankan server lokal mode development dengan auto-reload (Nodemon + TSX) |
| `npm run dev:staging`              | Menjalankan server lokal yang dihubungkan ke env `.env.staging`              |
| `npm run build`                    | Mengompilasi TypeScript ke dalam folder executable JavaScript `dist`         |
| `npm run start`                    | Menjalankan hasil kompilasi production di folder `dist`                      |
| `npm run start:staging`            | Menjalankan hasil build dengan konfigurasi `.env.staging`                    |
| `npm run start:production`         | Menjalankan hasil build dengan konfigurasi `.env.production`                 |
| `npm run lint`                     | Melakukan pengecekan tipe TypeScript dan validasi ESLint                     |
| `npm run db:generate`              | Men-generate client Prisma untuk type-safety                                 |
| `npm run db:push`                  | Mengunggah / menyinkronkan skema prisma langsung ke DB development           |
| `npm run db:push:staging`          | Menyinkronkan skema prisma ke DB staging menggunakan `.env.staging`          |
| `npm run db:migrate:dev`           | Membuat dan menjalankan file migrasi database development                    |
| `npm run db:migrate:reset`         | Menghapus dan membangun ulang seluruh migrasi database                       |
| `npm run db:migrate:reset:staging` | Mereset migrasi database staging menggunakan `.env.staging`                  |
| `npm run db:studio`                | Membuka antarmuka grafis data database via Prisma Studio                     |

---

## 🐳 Dockerization (Docker Compose)

Proyek ini telah dikonfigurasi menggunakan Docker Compose untuk mempermudah eksekusi dan orkestrasi server backend Express.js serta database cache Redis di dalam kontainer.

### 1. Persiapan

Pastikan file `.env.staging` Anda sudah terisi secara lengkap dan benar di folder root.

### 2. Menjalankan Container

Jalankan perintah berikut:

```bash
docker compose up --build -d
```

_Docker Compose akan mem-build image API, mengunduh image Redis, dan menjalankan keduanya di background._

### 3. Menghentikan Container

Untuk mematikan container dan membersihkan jaringannya:

```bash
docker compose down
```

### 4. Detail Optimasi & Arsitektur Docker

- **Bypass Isu Pemblokiran ISP (CloudFront Registry Timeout)**:
  Image Docker ditarik menggunakan mirror **AWS ECR Public Gallery** (`public.ecr.aws/docker/library/node:22-alpine` & `public.ecr.aws/docker/library/redis:7-alpine`) untuk memastikan pulling image tetap lancar dan cepat tanpa kendala pemutusan koneksi (EOF/Timeout) dari CDN Docker Hub.
- **Prisma Client Caching**:
  Dockerfile dikonfigurasi dengan _multi-stage build_. Untuk mencegah error `Prisma Client could not locate the Query Engine`, direktori `/app/generated` disalin secara utuh dari tahap _builder_ ke tahap _runner_ akhir.
- **Keamanan Rahasia (Secrets)**:
  File `.env` dan `.env.*` diabaikan oleh `.dockerignore` sehingga rahasia tidak bocor ke dalam image kontainer. Nilai environment disuntikkan secara dinamis pada saat _runtime_ melalui berkas `.env.staging` menggunakan parameter `env_file` di `docker-compose.yaml`.
- **Komunikasi Internal Container ke Local AI Model**:
  Dalam `docker-compose.yaml`, kami menambahkan konfigurasi `extra_hosts` untuk memetakan `host.docker.internal` ke `host-gateway`. Hal ini memungkinkan kontainer API backend (`eco_wise_api`) untuk mengakses endpoint model AI yang berjalan di komputer lokal Anda (`http://host.docker.internal:8000`) dengan aman tanpa kendala penolakan jaringan (_Connection Refused_).

---

## 📖 Dokumentasi API

> **API Base Path:** Seluruh endpoint berada di bawah `/api`.
> **Health Check:** Lakukan `GET /` untuk memastikan server berjalan normal.

Dokumentasi detail tiap endpoint tersedia pada direktori `docs/api-docs`:

- 🔐 [`auth-api.md`](docs/api-docs/01-Auth.md)
- 👤 [`user-api.md`](docs/api-docs/02-Users.md)
- 🗑️ [`waste-categories-api.md`](docs/api-docs/03-WasteCategories.md)
- ❓ [`faqs-api.md`](docs/api-docs/08-FAQs.md)
- ✅ [`daily-tasks-api.md`](docs/api-docs/06-DailyTasks.md)
- 🌟 [`eco-points-api.md`](docs/api-docs/05-EcoPoints.md)
- 📷 [`scan-history-api.md`](docs/api-docs/07-ScanHistory.md)
- 🎯 [`user-task-completions-api.md`](docs/api-docs/09-UserTaskCompletions.md)
- 📈 [`statistics-api.md`](docs/api-docs/09-Statistics.md)
- 🩺 [`health-api.md`](docs/api-docs/10-Health.md)

---

## 🧩 Modul Utama

Arsitektur logika dibagi menjadi beberapa modul independen:

- **`auth`**: Registrasi, login, logout, dan pembaruan password.
- **`users`**: Manajemen sesi, pembaruan avatar, pengaturan profil, dan _role_.
- **`waste-categories`**: Manajemen master data kategori sampah.
- **`faqs`**: Pengelolaan pertanyaan umum untuk publik maupun admin.
- **`daily-tasks`**: Pengelolaan tugas harian (misal: memilah sampah jenis X).
- **`eco-points`**: Pelacakan aktivitas _streak_ mingguan dan papan peringkat (Leaderboard).
- **`scan-history`**: Mengunggah citra (_image upload_) dan merekam hasil prediksi sampah.
- **`user-task-completions`**: Verifikasi penyelesaian tugas berbasis hasil pindaian.
- **`statistics`**: Pembuatan laporan dan data visual untuk dashboard admin.

---

## 📝 Catatan Implementasi

- **Caching:** Redis digunakan secara ekstensif untuk session, FAQ, kategori sampah, eco points, histori pindaian, dan statistik guna mengurangi beban database utama.
- **Autentikasi & Storage:** Mengandalkan integrasi langsung ke ekosistem Supabase.
- **Akses Data:** Menggunakan Prisma sebagai ORM utama karena memberikan jaminan _type-safety_.

---
