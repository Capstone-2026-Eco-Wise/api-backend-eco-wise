# User API Documentation

Base URL: `/api/users`

Semua endpoint untuk module User membutuhkan Header Authentication.

## Headers

```http
Authorization: Bearer <token>
```

---

## 1. Get Current User Session (Me)

Endpoint untuk mengambil data profil user yang sedang login berdasarkan token. Endpoint ini sudah terintegrasi dengan sistem caching Redis (akan mengambil data dari cache jika tersedia).

**URL:** `/me`
**Method:** `GET`
**Auth Required:** Yes

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "User successfully retrieved (from cache)",
  "data": {
    "id": "uuid",
    "email": "johndoe@example.com",
    "full_name": "John Doe",
    "username": "johndoe99",
    "avatar_url": "https://..."
  }
}
```

### Error Response (401 Unauthorized)
Jika token tidak dikirim, kadaluarsa, atau tidak valid.
```json
{
  "status": 401,
  "message": "Unauthenticated, please login",
  "data": null
}
```

---

## 2. Update User Avatar

Endpoint untuk memperbarui foto profil (avatar) pengguna. Endpoint ini menerima form-data dengan file gambar (maksimal 5MB, format JPEG/PNG/WebP). Endpoint ini juga akan otomatis menghapus cache session user dan gambar lama di storage.

**URL:** `/me/avatar`
**Method:** `PATCH`
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

### Request Body (Form Data)
- `avatar`: File gambar yang ingin diunggah.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfuly update avatar user",
  "data": {
    "id": "uuid",
    "email": "johndoe@example.com",
    "full_name": "John Doe",
    "username": "johndoe99",
    "avatar_url": "https://url-ke-gambar-baru.jpg"
  }
}
```

---

## 3. Get All Users

Endpoint untuk mengambil seluruh data pengguna. Mendukung pencarian dan paginasi.

**URL:** `/`
**Method:** `GET`
**Auth Required:** Yes
**Role Required:** Admin

### Query Parameters
- `page` (number, opsional)
- `limit` (number, opsional)
- `role` (string, opsional): Filter berdasarkan role (`admin` atau `user`)
- `search` (string, opsional): Pencarian nama, email, atau username

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Get all users successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "User Name",
        "role": "user"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalData": 100,
      "totalPage": 10
    }
  }
}
```

---

## 4. Update Profile User

Endpoint untuk memperbarui data profil dasar pengguna.

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

Endpoint untuk mengubah hak akses pengguna.

**URL:** `/:id/role`
**Method:** `PATCH`
**Auth Required:** Yes
**Role Required:** Admin

### Parameters
- `id` (path, string): UUID dari pengguna.

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
