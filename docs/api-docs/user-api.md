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
