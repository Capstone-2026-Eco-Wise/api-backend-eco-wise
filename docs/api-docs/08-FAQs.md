# FAQs API Documentation

Base URL: `/api/faqs`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Create FAQ

Endpoint admin untuk membuat FAQ baru.

**URL:** `/`
**Method:** `POST`
**Auth Required:** Yes
**Role Required:** Admin

### Request Body

```json
{
  "question": "Bagaimana cara mendapatkan poin?",
  "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
  "category": "system",
  "orderNumber": 1,
  "isActive": true
}
```

### Success Response (201 Created)

```json
{
  "status": 201,
  "message": "FAQ created successfully",
  "data": {
    "id": "uuid",
    "question": "Bagaimana cara mendapatkan poin?",
    "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
    "category": "system",
    "orderNumber": 1,
    "isActive": true,
    "createdBy": "uuid-admin",
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T10:00:00.000Z"
  }
}
```

---

## 2. Get Public FAQs

Endpoint publik untuk mengambil FAQ aktif.

**URL:** `/public`
**Method:** `GET`
**Auth Required:** No

### Query Parameters

- `category` (string, optional)

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "FAQs retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "question": "Bagaimana cara mendapatkan poin?",
      "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
      "category": "system",
      "orderNumber": 1,
      "isActive": true,
      "createdAt": "2026-05-16T10:00:00.000Z"
    }
  ]
}
```

---

## 3. Get FAQs By Creator

Endpoint admin untuk mengambil FAQ milik creator login.

**URL:** `/creator`
**Method:** `GET`
**Auth Required:** Yes
**Role Required:** Admin

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "FAQs retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "question": "Bagaimana cara mendapatkan poin?",
      "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
      "category": "system",
      "orderNumber": 1,
      "isActive": true,
      "createdBy": "uuid-admin",
      "createdAt": "2026-05-16T10:00:00.000Z"
    }
  ]
}
```

---

## 4. Update FAQ By Creator

Endpoint admin untuk update FAQ yang dibuat oleh user login.

**URL:** `/:id`
**Method:** `PUT`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter

- `id`: UUID FAQ.

### Request Body

```json
{
  "question": "Bagaimana cara mendapatkan Eco Points?",
  "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
  "category": "system",
  "orderNumber": 2,
  "isActive": false
}
```

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "FAQ updated successfully",
  "data": {
    "id": "uuid",
    "question": "Bagaimana cara mendapatkan Eco Points?",
    "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
    "category": "system",
    "orderNumber": 2,
    "isActive": false,
    "createdBy": "uuid-admin",
    "updatedBy": "uuid-admin",
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T11:00:00.000Z"
  }
}
```

---

## 5. Delete FAQ By Creator

Endpoint admin untuk menghapus FAQ milik creator login.

**URL:** `/:id`
**Method:** `DELETE`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter

- `id`: UUID FAQ.

### Success Response (200 OK)

```json
{
  "status": 200,
  "message": "FAQ deleted successfully",
  "data": {
    "id": "uuid",
    "question": "Bagaimana cara mendapatkan Eco Points?",
    "answer": "Poin didapatkan dengan menukarkan sampah di fasilitas terdekat.",
    "category": "system",
    "orderNumber": 1,
    "isActive": false,
    "createdBy": "uuid-admin",
    "updatedBy": "uuid-admin",
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T11:00:00.000Z"
  }
}
```
