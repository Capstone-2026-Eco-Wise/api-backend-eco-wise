# Auth API Documentation

Base URL: `/api/auth`

Semua endpoint digunakan untuk autentikasi user.

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Register User

Endpoint untuk mendaftarkan user baru.

**URL:** `/sign-up`
**Method:** `POST`
**Auth Required:** No
**Rate Limit:** 5 request per 15 menit per IP.

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
      "totalPoints": 0,
      "currentStreak": 0,
      "longestStreak": 0,
      "lastActiveDate": "2026-05-21T00:00:00.000Z"
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

## 2. Login User

Endpoint untuk login dan mendapatkan token akses.

**URL:** `/sign-in`
**Method:** `POST`
**Auth Required:** No
**Rate Limit:** 5 request per 15 menit per IP.

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

## 3. Logout User

Endpoint untuk logout user dan menghapus sesi Supabase.

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

### Error Response (401 Unauthorized)
```json
{
  "status": 401,
  "message": "Session not found",
  "data": null
}
```

---

## 4. Update Password

Endpoint untuk mengganti password user yang sedang login.

**URL:** `/update-password`
**Method:** `PUT`
**Auth Required:** Yes
**Rate Limit:** 5 request per 15 menit per IP.

### Request Body
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Password updated successfully",
  "data": {
    "access_token": "new-jwt-token",
    "refresh_token": "new-jwt-refresh-token"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "status": 400,
  "message": "Old password is incorrect",
  "data": null
}
```

---

## 5. Register Admin

Endpoint untuk mendaftarkan user baru dengan role admin. Memerlukan secret key yang valid.

**URL:** `/sign-up/admin`
**Method:** `POST`
**Auth Required:** No
**Rate Limit:** 5 request per 15 menit per IP.

### Request Body
```json
{
  "email": "admin@example.com",
  "fullName": "Admin User",
  "username": "admin123",
  "password": "StrongPassword123!",
  "adminSecret": "kode-rahasia-dari-env"
}
```

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "Admin registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "jwt-refresh-token"
    }
  }
}
```

### Error Response (403 Forbidden)
```json
{
  "status": 403,
  "message": "Invalid admin secret key",
  "data": null
}
```
