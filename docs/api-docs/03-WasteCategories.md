# Waste Categories API Documentation

Base URL: `/api/waste-categories`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Create Waste Category

Endpoint admin untuk menambahkan kategori sampah.

**URL:** `/`
**Method:** `POST`
**Auth Required:** Yes
**Role Required:** Admin

### Request Body

```json
{
  "categoryCode": "ORG",
  "categoryName": "Organik",
  "description": "Sampah mudah terurai",
  "handlingTips": "Pisahkan dari sampah lain",
  "colorHex": "#2196F3",
  "pointsReward": 10
}
```

### Success Response (201 Created)

```json
{
  "status": 201,
  "message": "Succesfully create waste category",
  "data": {
    "id": "uuid",
    "categoryCode": "ORG",
    "categoryName": "Organik",
    "description": "Sampah mudah terurai",
    "handlingTips": "Pisahkan dari sampah lain",
    "colorHex": "#2196F3",
    "pointsReward": 10,
    "createdAt": "2026-04-26T00:00:00.000Z",
    "updatedAt": "2026-04-26T00:00:00.000Z"
  }
}
```

### Error Response (409 Conflict)

```json
{
  "status": 409,
  "message": "Conflict: categoryCode already exists",
  "data": null
}
```

---

## 2. Get All Waste Categories

Endpoint publik untuk mengambil seluruh kategori sampah.

**URL:** `/`
**Method:** `GET`
**Auth Required:** No

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "Succesfully get all waste categories",
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
    }
  ]
}
```

---

## 3. Get Waste Category By ID

Endpoint publik untuk mengambil detail kategori sampah.

**URL:** `/:id`
**Method:** `GET`
**Auth Required:** No

### Path Parameter

- `id`: UUID kategori sampah.

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

```json
{
  "status": 404,
  "message": "Waste Category is Not Found",
  "data": null
}
```

---

## 4. Update Waste Category

Endpoint admin untuk mengubah kategori sampah.

**URL:** `/:id`
**Method:** `PATCH`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter

- `id`: UUID kategori sampah.

### Request Body

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

Endpoint admin untuk menghapus kategori sampah.

**URL:** `/:id`
**Method:** `DELETE`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter

- `id`: UUID kategori sampah.

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
