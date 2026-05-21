# Scan History API Documentation

Base URL: `/api/scan-history`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Scan Image

Endpoint untuk upload gambar dan menyimpan hasil prediksi ke history.

**URL:** `/`
**Method:** `POST`
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

### Form Data
- `image`: file gambar.

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
    "confidenceScore": 0.955,
    "rawPredictions": {
      "organik": 0.05,
      "non_organik": 0.9,
      "b3": 0.03,
      "bukan_sampah": 0.02
    },
    "pointEarned": 10,
    "label": "non_organik",
    "tips": "Pisahkan sampah non organik untuk daur ulang.",
    "tokenUser": 4,
    "latency": 1234
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "status": 400,
  "message": "Image not found",
  "data": null
}
```

---

## 2. Get All Scan History

Endpoint untuk mengambil riwayat scan user login.

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
      "confidenceScore": 0.955,
      "pointEarned": 10,
      "scannedAt": "2026-05-09T10:00:00.000Z"
    }
  ]
}
```

---

## 3. Get Scan History By ID

Endpoint untuk mengambil detail history scan spesifik.

**URL:** `/:id`
**Method:** `GET`
**Auth Required:** Yes

### Path Parameter
- `id`: UUID scan history.

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
    "confidenceScore": 0.955,
    "rawPredictions": {
      "organik": 0.05,
      "non_organik": 0.9
    },
    "pointEarned": 10,
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
