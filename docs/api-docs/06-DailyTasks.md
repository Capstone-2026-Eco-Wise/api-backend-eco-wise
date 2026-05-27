# Daily Tasks API Documentation

Base URL: `/api/daily-tasks`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Create Daily Task

Endpoint admin untuk membuat daily task.

**URL:** `/`
**Method:** `POST`
**Auth Required:** Yes
**Role Required:** Admin

### Request Body
```json
{
  "categoryId": "uuid",
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

Endpoint untuk mengambil daftar daily task dengan filter dan pagination.

**URL:** `/`
**Method:** `GET`
**Auth Required:** Yes

### Query Parameters
- `page` (number, optional)
- `limit` (number, optional)
- `search` (string, optional)
- `sort` (string, optional)
- `order` (`asc` | `desc`, optional)
- `category` (uuid, optional)
- `active` (`true` | `false`, optional)

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully retrieved daily tasks",
  "data": {
    "data": [
      {
        "id": "uuid",
        "taskName": "Kumpulkan 10 Botol Plastik",
        "description": "Tugas mengumpulkan botol",
        "pointReward": 50,
        "isActive": true,
        "activeDate": "2026-05-09T00:00:00.000Z",
        "category": {
          "id": "uuid",
          "categoryName": "Anorganik",
          "categoryCode": "ANORGANIK"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalData": 1,
      "totalPage": 1
    }
  }
}
```

---

## 3. Get Daily Task By ID

Endpoint untuk mengambil detail daily task.

**URL:** `/:id`
**Method:** `GET`
**Auth Required:** Yes

### Path Parameter
- `id`: UUID daily task.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully retrieved daily tasks",
  "data": {
    "id": "uuid",
    "taskName": "Kumpulkan 10 Botol Plastik",
    "description": "Tugas mengumpulkan botol",
    "pointReward": 50,
    "isActive": true,
    "activeDate": "2026-05-09T00:00:00.000Z"
  }
}
```

---

## 4. Update Daily Task

Endpoint admin untuk mengubah daily task.

**URL:** `/:id`
**Method:** `PUT`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter
- `id`: UUID daily task.

### Request Body
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
  "message": "Successfully updated daily tasks",
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

## 5. Delete Daily Task

Endpoint admin untuk menghapus daily task.

**URL:** `/:id`
**Method:** `DELETE`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter
- `id`: UUID daily task.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully deleted daily tasks",
  "data": {
    "id": "uuid"
  }
}
```
