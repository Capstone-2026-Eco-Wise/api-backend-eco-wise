# Statistics API Documentation

Base URL: `/api/statistics`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Get Dashboard Statistics

Endpoint admin untuk mengambil ringkasan statistik aplikasi.

**URL:** `/`
**Method:** `GET`
**Auth Required:** Yes
**Role Required:** Admin

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalUsers": 100,
    "totalAdmins": 5,
    "totalScans": 1200,
    "totalPoints": 35000,
    "totalFaqs": 20,
    "totalDailyTasks": 15,
    "totalWasteCategories": 8
  }
}
```
