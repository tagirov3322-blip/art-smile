# API Documentation — Art Smile

Base URL: `http://localhost:4000/api`

## Аутентификация

JWT с access + refresh токенами.
- Access token: 15 минут
- Refresh token: 7 дней

Защищённые роуты требуют заголовок:
```
Authorization: Bearer <ACCESS_TOKEN>
```

При 401 — обновить токен через `/auth/refresh`.

---

## Auth

### POST /auth/login
**Body:**
```json
{ "login": "admin", "password": "пароль" }
```
**Response 200:**
```json
{ "accessToken": "...", "refreshToken": "..." }
```

### POST /auth/refresh
**Body:**
```json
{ "refreshToken": "..." }
```
**Response 200:**
```json
{ "accessToken": "...", "refreshToken": "..." }
```

### POST /auth/setup
Создание первого админа (работает только если админов нет).
**Body:**
```json
{ "login": "admin", "password": "пароль123" }
```

---

## Услуги (Services)

### GET /services
Публичный. Query: `?category=Гигиена&active=true`

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Чистка зубов",
    "description": "Профессиональная чистка...",
    "price": 3000,
    "duration": 60,
    "category": "Гигиена",
    "isActive": true,
    "createdAt": "2026-04-01T00:00:00.000Z"
  }
]
```

### GET /services/:id
### POST /services *(admin)* — Body: `{ name, description?, price, duration?, category?, isActive? }`
### PUT /services/:id *(admin)* — Body: любые поля из POST
### DELETE /services/:id *(admin)*

---

## Врачи (Doctors)

### GET /doctors
Публичный. Query: `?active=true`

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Иванов Иван",
    "specialty": "Терапевт",
    "experience": 10,
    "photo": "https://...",
    "description": "...",
    "isActive": true,
    "schedule": {
      "monday": { "start": "09:00", "end": "18:00" },
      "tuesday": { "start": "09:00", "end": "18:00" }
    }
  }
]
```

### GET /doctors/:id
### POST /doctors *(admin)* — Body: `{ name, specialty, experience?, photo?, description?, isActive?, schedule? }`
### PUT /doctors/:id *(admin)*
### DELETE /doctors/:id *(admin)*

---

## Записи (Bookings)

### GET /bookings *(admin)*
Query: `?status=new&doctorId=1&search=Иванов&page=1&limit=20`

**Response 200:**
```json
{
  "bookings": [
    {
      "id": 1,
      "patientName": "Петров Пётр",
      "phone": "+79001234567",
      "date": "2026-04-15T00:00:00.000Z",
      "time": "10:00",
      "comment": "Болит зуб",
      "status": "new",
      "smsSent": false,
      "doctor": { "id": 1, "name": "Иванов Иван", ... },
      "service": { "id": 1, "name": "Чистка зубов", ... },
      "createdAt": "..."
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

### POST /bookings
Публичный. Создание записи.

**Body:**
```json
{
  "patientName": "Петров Пётр",
  "phone": "+79001234567",
  "doctorId": 1,
  "serviceId": 1,
  "date": "2026-04-15",
  "time": "10:00",
  "comment": "Болит зуб",
  "consentGiven": true
}
```

**Валидация:**
- `phone` — формат `+7XXXXXXXXXX`
- `consentGiven` — обязательно `true`
- Один номер = одна активная заявка
- Врач и услуга должны существовать и быть активными

**Побочные эффекты:**
- SSE event `new_booking` в админку
- Telegram уведомление менеджеру (с кнопками Подтвердить/Отклонить)
- SMS пациенту "Запись принята"

### PUT /bookings/:id *(admin)*
**Body:** `{ status?: "new"|"confirmed"|"completed"|"cancelled" }`

При смене на `confirmed` → SMS "Запись подтверждена на дату/время"
При смене на `cancelled` → SMS "Запись отменена, позвоните для перезаписи"

### DELETE /bookings/:id *(admin)*

---

## Отзывы (Reviews)

### GET /reviews
Публичный. Только одобренные и видимые.
Query: `?source=2gis&page=1&limit=20`

**Response 200:**
```json
{
  "reviews": [
    {
      "id": 1,
      "authorName": "Мария",
      "text": "Отличная клиника!",
      "rating": 5,
      "source": "2gis",
      "createdAt": "..."
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

Значения `source`: `"site"`, `"2gis"`, `"yandex"`

### GET /reviews/all *(admin)* — все отзывы
Query: `?source=site&isApproved=false&page=1&limit=20`

### POST /reviews
Публичный. Оставить отзыв (уходит на модерацию).
**Body:** `{ authorName, text, rating: 1-5 }`

### PUT /reviews/:id *(admin)* — модерация
**Body:** `{ isApproved?: boolean, isVisible?: boolean }`

### DELETE /reviews/:id *(admin)*

---

## Акции (Promotions)

### GET /promotions
Публичный. Только активные, не истёкшие.

### GET /promotions/all *(admin)* — все акции

### POST /promotions *(admin)*
**Body:** `{ title, description?, image?, isActive?, startDate?, endDate? }`

### PUT /promotions/:id *(admin)*
### DELETE /promotions/:id *(admin)*

---

## Портфолио (Portfolio)

### GET /portfolio
Публичный. Query: `?doctorId=1&category=Имплантация`

### POST /portfolio *(admin)*
**Body:** `{ title, description?, beforePhoto?, afterPhoto?, category?, doctorId }`

### DELETE /portfolio/:id *(admin)*

---

## Загрузка файлов (Upload)

### POST /upload *(admin)*
**Content-Type:** `multipart/form-data`, field: `file` (макс. 5MB)

**Response 200:**
```json
{ "url": "https://xxx.supabase.co/storage/v1/object/public/photos/filename.jpg" }
```

---

## Статистика (Stats)

### GET /stats *(admin)*
```json
{
  "totalBookings": 150,
  "newBookings": 12,
  "confirmedBookings": 20,
  "completedBookings": 100,
  "cancelledBookings": 10,
  "todayBookings": 5,
  "totalDoctors": 8,
  "totalServices": 25,
  "totalReviews": 200,
  "pendingReviews": 3,
  "popularServices": [
    { "serviceId": 1, "serviceName": "Чистка зубов", "count": 45 }
  ]
}
```

---

## Настройки (Settings)

### GET /settings *(admin)*
### PUT /settings *(admin)*
**Body:**
```json
{
  "clinicName": "Art Smile",
  "phone": "+7...",
  "address": "...",
  "workingHours": { "monday": { "start": "09:00", "end": "18:00" } },
  "telegramChatId": "...",
  "smsEnabled": true
}
```

---

## Realtime (SSE)

### GET /events
Server-Sent Events для админки. Подключение:
```js
const es = new EventSource("http://localhost:4000/api/events");
es.addEventListener("new_booking", (e) => { /* новая запись */ });
es.addEventListener("booking_updated", (e) => { /* обновление */ });
es.addEventListener("booking_deleted", (e) => { /* удаление */ });
```

---

## Health Check

### GET /health
```json
{ "status": "ok", "uptime": 12345.67 }
```
