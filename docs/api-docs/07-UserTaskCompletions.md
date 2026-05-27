# User Task Completions API Documentation

Base URL: `/api/user-task-completions`

## Headers (Untuk endpoint terproteksi)

```http
Authorization: Bearer <token>
```

---

## 1. Create User Task Completion

Endpoint untuk submit bukti completion daily task.

**URL:** `/:taskId`
**Method:** `POST`
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

### Path Parameter
- `taskId`: UUID daily task.

### Form Data
- `image`: file gambar.

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "Task completed successfully",
  "data": {
    "scanHistory": {
      "id": "uuid",
      "pointEarned": 10,
      "label": "organik",
      "tokenUser": 4
    },
    "ecoPoints": {
      "id": "uuid",
      "totalPoints": 130,
      "currentStreak": 4,
      "longestStreak": 7
    },
    "completedTask": {
      "id": "uuid",
      "taskId": "uuid",
      "taskDate": "2026-05-21T00:00:00.000Z",
      "pointAwarded": 20,
      "isCompleted": true
    }
  }
}
```

### Error Response (404 Not Found)
```json
{
  "status": 404,
  "message": "Daily task not found",
  "data": null
}
```