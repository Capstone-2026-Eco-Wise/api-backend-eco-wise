# User API Documentation

Base URL: `/api/users`

Semua endpoint untuk `GET /me` dan `POST /sign-out` membutuhkan Header Authentication.

## Headers
```http
Authorization: Bearer <token>
```

---

## 1. Register User (Sign Up)

Endpoint untuk mendaftarkan akun baru.

**URL:** `/sign-up`
**Method:** `POST`
**Rate Limit:** Maksimal 5 request per 15 menit per IP.

### Request Body
```json
{
  "full_name": "John Doe",
  "email": "johndoe@example.com",
  "password": "StrongPassword123!",
  "username": "johndoe99"
}
```

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "User successfully registered",
  "data": {
    "user": {
      "id": "uuid",
      "email": "johndoe@example.com",
      // ...
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "jwt-refresh-token",
      // ...
    }
  }
}
```

### Error Response (400 Bad Request)
Jika validasi gagal atau email/username sudah digunakan.
```json
{
  "status": 400,
  "message": "Email already exists",
  "data": null
}
```

---

## 2. Login User (Sign In)

Endpoint untuk masuk dan mendapatkan token akses.

**URL:** `/sign-in`
**Method:** `POST`
**Rate Limit:** Maksimal 5 request per 15 menit per IP.

### Request Body
```json
{
  "email": "johndoe@example.com",
  "password": "StrongPassword123!"
}
```

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "User successfully signed in",
  "data": {
    "user": {
      "id": "uuid",
      "email": "johndoe@example.com",
      // ...
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "jwt-refresh-token",
      // ...
    }
  }
}
```

---

## 3. Get Current User Session (Me)

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
    "username": "johndoe99"
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

## 4. Logout User (Sign Out)

Endpoint untuk mengeluarkan user dan menghapus sesinya di sistem Supabase.

**URL:** `/sign-out`
**Method:** `POST`

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "User has been logged out",
  "data": null
}
```
