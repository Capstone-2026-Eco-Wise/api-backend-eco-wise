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
- [📊 Entity Relationship Diagram (ERD)](#-entity-relationship-diagram-erd)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [📜 Scripts](#-scripts)
- [🐳 Docker](#-docker)
- [🗄️ Integrasi & Migrasi Supabase](#️-integrasi--migrasi-supabase)
- [📖 Dokumentasi API](#-dokumentasi-api)
- [🧪 Pengujian (Testing)](#-pengujian-testing)
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
api-backend-eco-wise/
├── src/
│   ├── app.ts                 # Konfigurasi aplikasi Express
│   ├── server.ts              # Entry point untuk menjalankan server
│   ├── errors/                # Penanganan error kustom (AppError, global handler)
│   ├── infrastructure/        # Setup koneksi database & external client (Prisma, Redis)
│   ├── middlewares/           # Middleware global (auth, rate-limiter, validator)
│   ├── modules/               # Modul fitur bisnis (domain logic)
│   │   ├── auth/              # Otentikasi user
│   │   ├── daily-tasks/       # Pengelolaan tugas harian
│   │   ├── eco-points/        # Pelacakan poin & streak
│   │   ├── faqs/              # Pertanyaan umum (FAQ)
│   │   ├── scan-history/      # Riwayat klasifikasi AI
│   │   ├── statistics/        # Laporan & dashboard stats
│   │   ├── user-task-completions/ # Penyelesaian tugas harian user
│   │   ├── users/             # Detail profil user
│   │   └── waste-categories/  # Master data kategori sampah
│   ├── routes/                # Router Express yang menghubungkan setiap endpoint
│   ├── services/              # Layanan eksternal (AI Model integration & Storage)
│   ├── types/                 # Definisi tipe kustom & deklarasi modul TypeScript
│   ├── utils/                 # Fungsi utilitas bantu (logger, helper)
│   └── validations/           # Skema validasi request menggunakan Zod
├── prisma/
│   ├── schema.prisma          # Skema database relasional
│   └── migrations/            # Berkas riwayat migrasi SQL PostgreSQL
├── docs/
│   ├── api-docs/              # Markdown dokumentasi detail API
│   └── erd/                   # Visualisasi Entity Relationship Diagram
├── supabase/
│   └── user-migration.sql     # Skrip PostgreSQL untuk trigger sync users
├── test/
│   ├── Eco Wise.postman_collection.json            # Collection Postman untuk API testing
│   └── Eco-Wise-Env-Local.postman_environment.json # Environment Postman untuk lokal dev
├── Dockerfile                 # Konfigurasi pembuatan Docker image
├── docker-compose.yaml        # Orkestrasi container local API & Redis
├── vercel.json                # Konfigurasi hosting/deployment ke Vercel
├── eslint.config.ts           # Konfigurasi linter kode ESLint
├── tsconfig.json              # Konfigurasi compiler TypeScript
└── package.json               # Dependensi proyek & skrip npm
```

---

## 📊 Entity Relationship Diagram (ERD)

Untuk mempermudah pemahaman struktur data dalam database **Eco Wise**, berikut adalah Entity Relationship Diagram (ERD):

![ERD Eco Wise](docs/erd/ERD-Eco-Wise.webp)

Skema database terdiri dari tabel-tabel utama berikut:

- **`users`**: Menyimpan profil pengguna serta kuota token AI.
- **`eco_points`**: Menyimpan pencapaian poin keberlanjutan pengguna, riwayat _streak_ harian, dan pencapaian _streak_ terpanjang (_longest streak_).
- **`scan_history`**: Mencatat riwayat pemindaian sampah pengguna, termasuk URL gambar yang diunggah ke storage, skor kepercayaan dari model klasifikasi AI, serta poin yang didapatkan.
- **`waste_categories`**: Tabel master untuk jenis-jenis sampah (Organik, Non-Organik, B3, dsb), tips pengolahan, serta alokasi poin dasarnya.
- **`daily_tasks`**: Menyimpan misi/tugas harian yang dirilis oleh admin dengan target kategori sampah tertentu.
- **`user_task_completions`**: Mencatat penyelesaian tugas harian oleh pengguna untuk verifikasi pemberian poin.
- **`faqs`**: Daftar pertanyaan dan jawaban umum yang dikelola oleh admin untuk membantu pengguna.

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
| `HOST`                | Host binding interface                              | `[IP_ADDRESS]`                                                      |
| `NODE_ENV`            | Mode aplikasi                                       | `development`, `staging`, atau `production`                         |
| `ORIGIN_ALLOWED`      | URL origin frontend yang diizinkan CORS             | `http://localhost:5173`                                             |
| `REDIS_URL`           | String koneksi Redis                                | `redis://localhost:6379/1`                                          |
| `DATABASE_PASSWORD`   | Password PostgreSQL                                 | `your_db_password`                                                  |
| `DATABASE_URL`        | URL PostgreSQL Connection Pooler (Pgbouncer)        | `postgresql://postgres:your_db_password@your_db_host:6543/postgres` |
| `DIRECT_URL`          | URL PostgreSQL Direct Connection (Non-pooler)       | `postgresql://postgres:your_db_password@your_db_host:5432/postgres` |
| `SUPABASE_URL`        | URL Proyek Supabase                                 | `https://your_db_host.supabase.co`                                  |
| `SUPABASE_ANON_KEY`   | Anon Key proyek Supabase                            | `your_anon_key`                                                     |
| `SUPABASE_JWT_SECRET` | JWT Secret dari Supabase Auth                       | `your_jwt_secret`                                                   |
| `AI_API_URL`          | URL Endpoint REST API Model AI                      | `your_ai_host`                                                      |
| `ADMIN_SECRET_KEY`    | Kunci rahasia untuk meregistrasi user sebagai Admin | `secret_key`                                                        |

---

## 📜 Scripts

Perintah npm script yang tersedia di `package.json`:

| Perintah                           | Deskripsi                                                                                            |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `npm run dev`                      | Menjalankan server lokal mode development dengan auto-reload (menggunakan berkas `.env.development`) |
| `npm run dev:staging`              | Menjalankan server lokal mode development yang dihubungkan ke berkas `.env.staging`                  |
| `npm run dev:prod`                 | Menjalankan server lokal mode development yang dihubungkan ke berkas `.env.production`               |
| `npm run build`                    | Melakukan generate Prisma Client dan mengompilasi TypeScript ke folder `dist`                        |
| `npm run start:dev`                | Menjalankan hasil kompilasi development di folder `dist` dengan berkas `.env.development`            |
| `npm run start:staging`            | Menjalankan hasil kompilasi staging di folder `dist` dengan berkas `.env.staging`                    |
| `npm run start:prod`               | Menjalankan hasil kompilasi production di folder `dist` dengan berkas `.env.production`              |
| `npm run db:generate`              | Men-generate client Prisma untuk type-safety                                                         |
| `npm run db:push:dev`              | Menyinkronkan skema Prisma langsung ke database development menggunakan `.env.development`           |
| `npm run db:push:staging`          | Menyinkronkan skema Prisma langsung ke database staging menggunakan `.env.staging`                   |
| `npm run db:push:prod`             | Menyinkronkan skema Prisma langsung ke database production menggunakan `.env.production`             |
| `npm run db:studio:dev`            | Membuka Prisma Studio untuk database development menggunakan `.env.development`                      |
| `npm run db:studio:staging`        | Membuka Prisma Studio untuk database staging menggunakan `.env.staging`                              |
| `npm run db:studio:prod`           | Membuka Prisma Studio untuk database production menggunakan `.env.production`                        |
| `npm run db:migrate:dev`           | Membuat dan menjalankan file migrasi database development menggunakan `.env.development`             |
| `npm run db:migrate:staging`       | Membuat dan menjalankan file migrasi database staging menggunakan `.env.staging`                     |
| `npm run db:migrate:prod`          | Membuat dan menjalankan file migrasi database production menggunakan `.env.production`               |
| `npm run db:migrate:reset:dev`     | Menghapus dan membangun ulang seluruh migrasi database development menggunakan `.env.development`    |
| `npm run db:migrate:reset:staging` | Menghapus dan membangun ulang seluruh migrasi database staging menggunakan `.env.staging`            |
| `npm run db:migrate:reset:prod`    | Menghapus dan membangun ulang seluruh migrasi database production menggunakan `.env.production`      |
| `npm run lint`                     | Melakukan pengecekan tipe TypeScript dan validasi ESLint                                             |

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

---

## 🗄️ Integrasi & Migrasi Supabase

Proyek ini menggunakan **Supabase** untuk dua kebutuhan utama:

1. **Autentikasi Pengguna**: Mengelola siklus pendaftaran (_signup_), masuk (_signin_), dan keamanan token JWT.
2. **Object Storage**: Menyimpan berkas avatar profil dan gambar hasil pemindaian sampah pengguna di bucket storage.

### Sinkronisasi Tabel User Otomatis (Database Trigger)

Untuk memastikan konsistensi data antara modul autentikasi bawaan Supabase (`auth.users`) dengan data bisnis aplikasi kita (`public.users`), kami menggunakan trigger PostgreSQL.

Skrip migrasi SQL dapat ditemukan di:

- 📄 `supabase/user-migration.sql`

Skrip ini akan membuat fungsi `public.handle_new_user()` yang berjalan secara otomatis setiap kali ada baris baru yang masuk di `auth.users`, lalu menyalin data profil dasar (email, nama lengkap, username buatan) ke tabel `public.users` dengan nilai bawaan 5 token AI.

**Cara Pemasangan:**
Jalankan query SQL yang ada pada berkas `supabase/user-migration.sql` di SQL Editor pada Dashboard proyek Supabase Anda.

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

## 🧪 Pengujian (Testing)

Pengujian endpoint REST API dalam proyek ini dilakukan menggunakan **Postman**. Berkas pengujian telah disediakan di dalam folder `test/`:

- 📁 `test/`
  - 📄 **Collection:** `Eco Wise.postman_collection.json` (Berisi kumpulan _request_ HTTP beserta pengujian otomatis untuk setiap endpoint).
  - 📄 **Environment:** `Eco-Wise-Env-Local.postman_environment.json` (Berisi variabel lingkungan lokal seperti URL dasar `http://localhost:3000`, token bearer, dsb).

### Langkah-langkah Menjalankan Pengujian:

1. Buka aplikasi **Postman**.
2. Klik tombol **Import** di sudut kiri atas.
3. Pilih dan impor berkas `Eco Wise.postman_collection.json` dan `Eco-Wise-Env-Local.postman_environment.json` dari folder `test/`.
4. Pilih environment **Eco-Wise-Env-Local** yang telah diimpor pada pemilih _environment_ di kanan atas Postman.
5. Anda dapat menguji endpoint satu per satu atau menggunakan **Collection Runner** untuk menjalankan semua tes secara otomatis dan memverifikasi fungsionalitas backend.

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
