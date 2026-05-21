# User API Documentation

Base URL: `/api/users`

Semua endpoint di module ini membutuhkan authentication header.

## Headers

```http
Authorization: Bearer <token>
```

---

## 1. Get Current User Session

Endpoint untuk mengambil data user yang sedang login.

**URL:** `/me`
**Method:** `GET`
**Auth Required:** Yes

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "User successfully retrieved",
  "data": {
    "id": "uuid",
    "email": "johndoe@example.com",
    "fullName": "John Doe",
    "username": "johndoe99",
    "role": "user",
    "avatar_url": "https://...",
    "aiTokens": 5
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "status": 401,
  "message": "Session not found",
  "data": null
}
```

---

## 2. Update User Avatar

Endpoint untuk upload avatar user.

**URL:** `/me/avatar`
**Method:** `PATCH`
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

### Form Data
- `avatar`: file gambar.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfully updated avatar user",
  "data": {
    "id": "uuid",
    "email": "johndoe@example.com",
    "fullName": "John Doe",
    "username": "johndoe99",
    "role": "user",
    "avatar_url": "https://url-ke-gambar-baru.jpg",
    "aiTokens": 5
  }
}
```

---

## 3. Get All Users

Endpoint admin untuk mengambil daftar user dengan pagination dan search.

**URL:** `/`
**Method:** `GET`
**Auth Required:** Yes
**Role Required:** Admin

### Query Parameters
- `page` (number, optional)
- `limit` (number, optional)
- `role` (`admin` | `user`, optional)
- `search` (string, optional)

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Get all users successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "fullName": "User Name",
        "username": "username",
        "email": "user@example.com",
        "role": "user",
        "avatar_url": null,
        "aiTokens": 5,
        "ecoPoints": {
          "totalPoints": 100,
          "currentStreak": 3,
          "longestStreak": 7
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

## 4. Update Profile User

Endpoint untuk update nama lengkap user.

**URL:** `/me/profile`
**Method:** `PATCH`
**Auth Required:** Yes

### Request Body
```json
{
  "fullName": "John Doe Baru"
}
```

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Update profile user successfuly",
  "data": {
    "id": "uuid",
    "fullName": "John Doe Baru"
  }
}
```

---

## 5. Update Role User

Endpoint admin untuk mengubah role user.

**URL:** `/:id/role`
**Method:** `PATCH`
**Auth Required:** Yes
**Role Required:** Admin

### Path Parameter
- `id`: UUID user.

### Request Body
```json
{
  "role": "admin"
}
```

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Update role user successfuly",
  "data": {
    "id": "uuid",
    "role": "admin"
  }
}
```

---

## 6. Delete User

Endpoint admin untuk menghapus user.

**URL:** `/:id`
**Method:** `DELETE`
**Auth Required:** Yes
**Role Required:** Admin

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Delete user successfuly",
  "data": {
    "id": "uuid"
  }
}
```
