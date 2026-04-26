# Waste Categories API Documentation

Base URL: `/api/waste-categories`

Beberapa endpoint membutuhkan Header Authentication dan Akses Khusus (Role: `admin`).

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Create Waste Category

Endpoint untuk menambahkan kategori sampah baru. Endpoint ini dibatasi hanya untuk user dengan _role_ admin.

**URL:** `/create`
**Method:** `POST`
**Auth Required:** Yes
**Role Required:** Admin

### Request Body

```json
{
  "categoryCode": "Anorganik",
  "categoryName": "Anorganik",
  "description": "Sampah sulit terurai",
  "handlingTips": "Pisahkan untuk daur ulang",
  "colorHex": "#2196F3",
  "pointsReward": 10
}
```

_(Catatan: `categoryCode`, `categoryName`, dan `pointsReward` wajib diisi. Kolom lainnya opsional)._

### Success Response (201 Created)

```json
{
  "status": 201,
  "message": "Succesfully create waste category",
  "data": {
    "id": "uuid",
    "categoryCode": "Anorganik",
    "categoryName": "Anorganik",
    "description": "Sampah sulit terurai",
    "handlingTips": "Pisahkan untuk daur ulang",
    "colorHex": "#2196F3",
    "pointsReward": 10,
    "created_at": "2026-04-26T00:00:00.000Z",
    "updated_at": "2026-04-26T00:00:00.000Z"
  }
}
```

### Error Response (400 Bad Request / 409 Conflict)

Jika data tidak valid atau `categoryCode` sudah digunakan.

```json
{
  "status": 409,
  "message": "Conflict: Category code already exists",
  "data": null
}
```

---

## 2. Get All Waste Categories

Endpoint untuk mengambil seluruh daftar kategori sampah. Endpoint ini mendukung sistem _caching_ dengan Redis.

**URL:** `/`
**Method:** `GET`
**Auth Required:** No

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "Succesfully get all waste categories (from cache)",
  "data": [
    {
      "id": "uuid",
      "categoryCode": "ANORGANIK",
      "categoryName": "Anorganik",
      "description": "Sampah sulit terurai",
      "handlingTips": "Pisahkan untuk daur ulang",
      "colorHex": "#2196F3",
      "pointsReward": 10,
      "createdAt": "2026-04-26T10:47:44.399Z",
      "updatedAt": "2026-04-26T10:47:46.302Z"
    },
    {
      "id": "uuid",
      "categoryCode": "BUKAN SAMPAH",
      "categoryName": "Bukan Sampah",
      "description": "Auto generated bukan sampah",
      "handlingTips": "Auto tips bukan sampah",
      "colorHex": "#2dd7eb",
      "pointsReward": 27,
      "createdAt": "2026-04-26T10:47:44.399Z",
      "updatedAt": "2026-04-26T10:47:46.302Z"
    }
  ]
}
```

---

## 3. Get Waste Category by ID

Endpoint untuk mengambil data spesifik dari satu kategori sampah berdasarkan ID.

**URL:** `/:id`
**Method:** `GET`
**Auth Required:** No

### Parameters

- `id` (path, string): UUID dari kategori sampah.

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "Successfully get waste category by id",
  "data": {
    "id": "uuid",
    "categoryCode": "ANORGANIK",
    "categoryName": "Anorganik",
    "description": "Sampah sulit terurai",
    "handlingTips": "Pisahkan untuk daur ulang",
    "colorHex": "#2196F3",
    "pointsReward": 10,
    "createdAt": "2026-04-26T10:47:44.399Z",
    "updatedAt": "2026-04-26T10:47:46.302Z"
  }
}
```

### Error Response (404 Not Found)

Jika ID kategori sampah tidak ditemukan di sistem.

```json
{
  "status": 404,
  "message": "Waste Category is Not Found",
  "data": null
}
```

---

## 4. Update Waste Category

Endpoint untuk memperbarui data spesifik kategori sampah. Anda tidak bisa mengubah `categoryCode` (Omitted by schema). Endpoint ini akan secara otomatis membersihkan cache list kategori sampah.

**URL:** `/update/:id`
**Method:** `PATCH`
**Auth Required:** Yes
**Role Required:** Admin

### Parameters

- `id` (path, string): UUID dari kategori sampah.

### Request Body (Semua atribut opsional)

```json
{
  "categoryName": "Sampah Anorganik Update",
  "pointsReward": 25
}
```

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "Successfully update waste category",
  "data": {
    "id": "uuid",
    "id": "uuid",
    "categoryCode": "ANORGANIK",
    "categoryName": "Sampah Anorganik Update",
    "description": "Sampah sulit terurai",
    "handlingTips": "Pisahkan untuk daur ulang",
    "colorHex": "#2196F3",
    "pointsReward": 25,
    "createdAt": "2026-04-26T10:47:44.399Z",
    "updatedAt": "2026-04-26T10:47:46.302Z"
  }
}
```

---

## 5. Delete Waste Category

Endpoint untuk menghapus kategori sampah dari sistem. Menghapus kategori juga akan menghapus/mengosongkan data di _cache_.

**URL:** `/delete/:id`
**Method:** `DELETE`
**Auth Required:** Yes
**Role Required:** Admin

### Parameters

- `id` (path, string): UUID dari kategori sampah.

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "Successfully delete waste category",
  "data": {
    "id": "uuid",
    "categoryCode": "ANORGANIK",
    "categoryName": "Anorganik",
    "description": "Sampah sulit terurai",
    "handlingTips": "Pisahkan untuk daur ulang",
    "colorHex": "#2196F3",
    "pointsReward": 25,
    "createdAt": "2026-04-26T10:47:44.399Z",
    "updatedAt": "2026-04-26T10:47:46.302Z"
  }
}
```
