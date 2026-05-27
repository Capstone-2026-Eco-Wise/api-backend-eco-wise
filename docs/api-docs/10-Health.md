# Health API Documentation

Base URL: `/api`

Endpoint untuk mengecek status aplikasi.

---

## 1. Health Check

**URL:** `/`
**Method:** `GET`
**Auth Required:** No

### Success Response (200 OK)
```json
{
  "status": "OK",
  "message": "Eco-Wise API is running!",
  "uptime": "1 day, 2 hours, 10 minutes",
  "memoryUsage": {
    "rss": 12345678,
    "heapTotal": 9876543,
    "heapUsed": 8765432
  },
  "environment": "development",
  "timeStamp": "2026-05-21T00:00:00.000Z"
}
```