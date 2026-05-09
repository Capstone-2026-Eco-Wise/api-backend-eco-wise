# Scan History API Documentation

Base URL: `/api/scan-history`

Semua endpoint membutuhkan Header Authentication.

## Headers

```http
Authorization: Bearer <token>
```

---

## 1. Create Scan History (Predict)

Endpoint untuk melakukan prediksi jenis sampah dari gambar yang diunggah dan menyimpannya ke dalam riwayat scan. Endpoint ini memanggil service Machine Learning untuk memproses gambar.

**URL:** `/`
**Method:** `POST`
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

### Request Body (Form Data)
- `image`: File gambar sampah yang ingin diprediksi.

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "Successfully predicted",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "categoryId": "uuid",
    "imageUrl": "https://...",
    "predictionScore": 95.5,
    "rawPredictions": "[{\"label\": \"Plastic\", \"score\": 0.955}]",
    "scannedAt": "2026-05-09T10:00:00.000Z"
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "status": 401,
  "message": "Image not found",
  "data": null
}
```

---

## 2. Get All Scan History

Endpoint untuk mengambil seluruh daftar riwayat scan dari user yang sedang login. Mendukung sistem caching dengan Redis.

**URL:** `/`
**Method:** `GET`
**Auth Required:** Yes

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully fetched history scan",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "categoryId": "uuid",
      "imageUrl": "https://...",
      "predictionScore": 95.5,
      "scannedAt": "2026-05-09T10:00:00.000Z"
    }
  ]
}
```

---

## 3. Get Scan History By ID

Endpoint untuk mengambil detail riwayat scan spesifik milik user yang sedang login beserta informasi detail kategori sampahnya.

**URL:** `/:id`
**Method:** `GET`
**Auth Required:** Yes

### Parameters
- `id` (path, string): UUID dari scan history.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully fetched scan history detail",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "categoryId": "uuid",
    "imageUrl": "https://...",
    "predictionScore": 95.5,
    "rawPredictions": "[...]",
    "scannedAt": "2026-05-09T10:00:00.000Z",
    "category": {
      "categoryCode": "PLASTIC",
      "categoryName": "Plastik",
      "description": "Sampah plastik",
      "colorHex": "#FF5733",
      "handlingTips": "Daur ulang",
      "pointsReward": 20
    }
  }
}
```
