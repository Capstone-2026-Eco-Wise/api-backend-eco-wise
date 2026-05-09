# Auth API Documentation

Base URL: `/api/auth`

Semua endpoint untuk otentikasi. Hanya endpoint `DELETE /sign-out` yang membutuhkan Header Authentication.

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Register User (Sign Up)

Endpoint untuk mendaftarkan akun baru.

**URL:** `/sign-up`
**Method:** `POST`

### Request Body
```json
{
  "email": "johndoe@example.com",
  "fullName": "John Doe",
  "username": "johndoe99",
  "password": "StrongPassword123!"
}
```

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "User successfully signed up",
  "data": {
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "jwt-refresh-token"
    },
    "ecoPoints": {
      "id": "uuid",
      "totalPoints": 0
    }
  }
}
```

### Error Response (400 Bad Request)
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
      "email": "johndoe@example.com"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "jwt-refresh-token"
    }
  }
}
```

---

## 3. Logout User (Sign Out)

Endpoint untuk mengeluarkan user dan menghapus sesinya di sistem Supabase.

**URL:** `/sign-out`
**Method:** `DELETE`
**Auth Required:** Yes

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "User has been signed out",
  "data": null
}
```
