# Eco Points API Documentation

Base URL: `/api/eco-points`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Get Streak Status

Endpoint untuk mengambil poin, streak, dan status streak user.

**URL:** `/streak`
**Method:** `GET`
**Auth Required:** Yes

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfuly get eco points and streak status",
  "data": {
    "diffDays": 0,
    "status": "active",
    "message": "Streak aktif! Scan besok untuk lanjutkan ke 4 hari.",
    "currentStreak": 3,
    "longestStreak": 7,
    "totalPoints": 120,
    "lastActiveDate": "2026-05-21T00:00:00.000Z"
  }
}
```

---

## 2. Get Leaderboard

Endpoint publik untuk mengambil leaderboard berdasarkan poin atau streak.

**URL:** `/leaderboard`
**Method:** `GET`
**Auth Required:** No

### Query Parameters
- `type` (`currentStreak` | `totalPoints`, optional)

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Successfuly get leaderboard",
  "data": [
    {
      "userId": "uuid",
      "totalPoints": 120,
      "currentStreak": 3,
      "longestStreak": 7,
      "lastActiveDate": "2026-05-21T00:00:00.000Z"
    }
  ]
}
```
