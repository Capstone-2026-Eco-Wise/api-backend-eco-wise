# Daily Tasks API Documentation

Base URL: `/api/daily-tasks`

Beberapa endpoint membutuhkan Header Authentication dan Akses Khusus (Role: `admin`).

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Create Daily Task

Endpoint untuk membuat tugas harian (daily task) baru. Hanya dapat diakses oleh admin.

**URL:** `/`
**Method:** `POST`
**Auth Required:** Yes
**Role Required:** Admin

### Request Body
```json
{
  "categoryId": "uuid (opsional)",
  "taskName": "Kumpulkan 10 Botol Plastik",
  "description": "Tugas mengumpulkan botol",
  "pointReward": 50,
  "isActive": true,
  "activeDate": "2026-05-09"
}
```

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "Successfully created daily task",
  "data": {
    "id": "uuid",
    "categoryId": "uuid",
    "taskName": "Kumpulkan 10 Botol Plastik",
    "description": "Tugas mengumpulkan botol",
    "pointReward": 50,
    "isActive": true,
    "activeDate": "2026-05-09T00:00:00.000Z",
    "createdAt": "2026-05-09T10:00:00.000Z",
    "updatedAt": "2026-05-09T10:00:00.000Z"
  }
}
```

---

## 2. Get All Daily Tasks

Endpoint untuk mengambil daftar tugas harian. Mendukung fitur query untuk filter, pencarian, dan paginasi.

**URL:** `/`
**Method:** `GET`
**Auth Required:** Yes
**Role Required:** Admin

### Query Parameters
- `category` (string, opsional): UUID kategori sampah.
- `active` (boolean, opsional): `true` atau `false` untuk filter status aktif.
- `search` (string, opsional): Kata kunci pencarian nama tugas.
- `limit` (number, opsional): Jumlah data per halaman (default: 10).
- `page` (number, opsional): Nomor halaman (default: 1).
- `sort` (string, opsional): Kolom untuk pengurutan (default: `createdAt`).
- `order` (string, opsional): `asc` atau `desc` (default: `desc`).

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully fetched daily tasks",
  "data": {
    "data": [
      {
        "id": "uuid",
        "taskName": "Kumpulkan 10 Botol Plastik",
        "description": "Tugas mengumpulkan botol",
        "pointReward": 50,
        "isActive": true,
        "activeDate": "2026-05-09T00:00:00.000Z",
        "createdAt": "2026-05-09T10:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalData": 1,
      "totalPages": 1
    }
  }
}
```

---

## 3. Update Daily Task

Endpoint untuk mengubah data tugas harian berdasarkan ID.

**URL:** `/:id`
**Method:** `PUT`
**Auth Required:** Yes
**Role Required:** Admin

### Parameters
- `id` (path, string): UUID dari tugas harian.

### Request Body (Semua opsional)
```json
{
  "taskName": "Kumpulkan 15 Botol Plastik",
  "pointReward": 75,
  "isActive": false
}
```

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully updated daily task",
  "data": {
    "id": "uuid",
    "taskName": "Kumpulkan 15 Botol Plastik",
    "description": "Tugas mengumpulkan botol",
    "pointReward": 75,
    "isActive": false,
    "activeDate": "2026-05-09T00:00:00.000Z",
    "createdAt": "2026-05-09T10:00:00.000Z",
    "updatedAt": "2026-05-09T11:00:00.000Z"
  }
}
```

---

## 4. Delete Daily Task

Endpoint untuk menghapus tugas harian.

**URL:** `/:id`
**Method:** `DELETE`
**Auth Required:** Yes
**Role Required:** Admin

### Parameters
- `id` (path, string): UUID dari tugas harian.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully deleted daily task",
  "data": null
}
```
