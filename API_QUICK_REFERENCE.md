# API Quick Reference

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require: `Authorization: Bearer {token}`

---

## Endpoints by Module

### 🔐 AUTH (No auth required for register/login)
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | /auth/register | ❌ | email, password, fullName?, phone?, dateOfBirth? |
| POST | /auth/login | ❌ | email, password |
| GET | /auth/me | ✅ | - |

### 👤 USERS
| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | /users/me | ✅ | - | - |
| PUT | /users/me | ✅ | - | fullName?, phone?, dateOfBirth? |
| POST | /users/me/photo | ✅ | - | avatarUrl |
| PUT | /users/me/privacy | ✅ | - | settings: { [key]: boolean } |
| GET | /users/:id | ✅ | - | - |

### 👥 GROUPS
| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | /groups | ❌ | - | - |
| GET | /groups/:id | ✅ | - | - |
| POST | /groups | ✅ | TEACHER+ | name, description? |
| POST | /groups/:id/join | ✅ | - | - |
| DELETE | /groups/:id/leave | ✅ | - | - |
| PUT | /groups/:id | ✅ | ADMIN+ | name?, description? |
| DELETE | /groups/:id | ✅ | ADMIN+ | - |

### 📚 CLASSROOMS
| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | /classrooms | ❌ | - | - |
| GET | /classrooms/:id | ❌ | - | - |
| POST | /classrooms | ✅ | TEACHER+ | title, category, subject, isPaid? |
| PUT | /classrooms/:id | ✅ | TEACHER+ | title?, category?, subject?, isPaid? |
| GET | /classrooms/:classroomId/video/:lessonId | ✅ | - | - |
| POST | /classrooms/:classroomId/progress | ✅ | - | lessonId, progress |
| DELETE | /classrooms/:id | ✅ | ADMIN+ | - |

### 💬 CHAT
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| GET | /chat/rooms | ✅ | - |
| GET | /chat/rooms/:userId/messages | ✅ | limit?, offset? |
| POST | /chat/messages | ✅ | receiverId, content, type? |
| POST | /chat/messages/:id/report | ✅ | reason |

### 📰 NEWS
| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | /news | ❌ | - | - |
| GET | /news/:id | ❌ | - | - |
| GET | /news/hall-of-fame/entries | ❌ | - | - |
| POST | /news | ✅ | ADMIN+ | title, summary, details, tag? |
| PUT | /news/:id | ✅ | ADMIN+ | title?, summary?, details?, tag? |
| DELETE | /news/:id | ✅ | ADMIN+ | - |
| POST | /news/hall-of-fame/add | ✅ | ADMIN+ | title, summary, details? |

### ❓ PAST QUESTIONS
| Method | Endpoint | Auth | Query | Body |
|--------|----------|------|-------|------|
| GET | /questions | ❌ | examType?, subject?, year? | - |
| GET | /questions/search | ❌ | q*, examType?, subject? | - |
| GET | /questions/:id | ❌ | - | - |
| POST | /questions/:id/bookmark | ✅ | - | - |
| DELETE | /questions/:id/bookmark | ✅ | - | - |
| GET | /questions/bookmarks/my | ✅ | - | - |
| POST | /questions | ✅ | ADMIN+ | examType*, subject*, year*, questionText*, options*, correctOption*, isPaid? |

### 👫 FRIENDS
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| GET | /friends | ✅ | - |
| GET | /friends/requests/pending | ✅ | - |
| POST | /friends/request | ✅ | receiverId |
| PUT | /friends/:id/accept | ✅ | - |
| PUT | /friends/:id/reject | ✅ | - |

### ⚙️ ADMIN
| Method | Endpoint | Auth | Role | Query | Body |
|--------|----------|------|------|-------|------|
| GET | /admin/stats | ✅ | ADMIN+ | - | - |
| GET | /admin/users | ✅ | ADMIN+ | role?, tier?, limit?, offset? | - |
| PUT | /admin/users/:id/role | ✅ | ADMIN+ | - | role?, tier? |
| DELETE | /admin/users/:id | ✅ | ADMIN+ | - | - |
| GET | /admin/classrooms/activity | ✅ | ADMIN+ | - | - |
| GET | /admin/logs | ✅ | ADMIN+ | limit?, offset? | - |
| GET | /admin/ads/settings | ✅ | ADMIN+ | - | - |
| POST | /admin/ads/settings | ✅ | ADMIN+ | - | slot*, clientId?, isActive?, price? |

### 💳 PAYMENTS
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | /payments/checkout | ✅ | amount*, type*, provider* |
| POST | /payments/webhook | ❌ | (provider specific) |
| PUT | /payments/ad-free/toggle | ✅ | - |
| GET | /payments/history | ✅ | - |

### 📊 ANALYTICS
| Method | Endpoint | Auth | Role | Query |
|--------|----------|------|------|-------|
| GET | /analytics/active-users | ✅ | - | days? |
| GET | /analytics/popular-subjects | ✅ | - | - |
| GET | /analytics/engagement | ✅ | - | - |
| GET | /analytics/revenue | ✅ | ADMIN+ | days? |

---

## Role Hierarchy
```
STUDENT (level 1)
    ↓
TEACHER (level 2)
    ↓
ADMIN (level 3)
    ↓
MAIN_ADMIN (level 4)
```

---

## Tier Levels
- **PUBLIC**: Free, limited features
- **UNPAID**: Registered but no payment
- **PAID**: Premium access

---

## Common Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Results per page (default: 50) |
| offset | number | Skip N results (default: 0) |
| role | string | Filter by role (STUDENT, TEACHER, ADMIN) |
| tier | string | Filter by tier (PUBLIC, UNPAID, PAID) |
| examType | string | Filter questions by exam type |
| subject | string | Filter by subject |
| year | number | Filter by year |
| q | string | Search query (required for search) |
| days | number | Time period for analytics (default: 30) |

---

## HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

---

## Error Response Format
```json
{
  "error": "Human readable error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Success Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "meta": { /* pagination info */ },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Common Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Legend
- `*` = Required field
- `?` = Optional field
- `✅` = Requires authentication
- `❌` = No authentication required
- `TEACHER+` = TEACHER, ADMIN, or MAIN_ADMIN
- `ADMIN+` = ADMIN or MAIN_ADMIN

---

## Token Management
- Tokens expire after **7 days**
- Store token in localStorage: `localStorage.setItem('authToken', token)`
- Include in requests: `Authorization: Bearer {token}`
- On 401 response: Clear token and redirect to login

---

## Testing Tips
1. Use **Postman** or **Thunder Client** for API testing
2. Create environment variables for `base_url` and `token`
3. Test auth endpoints first (register/login)
4. Use token from login response in subsequent requests
5. Check Network tab in browser DevTools for debugging

---

## Common Integration Patterns

### Fetch with Auth
```javascript
fetch('http://localhost:5000/api/users/me', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
```

### Axios with Auth
```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

instance.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('authToken');
  return config;
});
```

### React Hook
```javascript
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/endpoint')
    .then(res => res.json())
    .then(json => setData(json.data));
}, []);
```

---

## Quick Links
- Full API Docs: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Frontend Integration: [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)
- Postman Collection: (To be created)

---

**Last Updated**: January 2025
**API Version**: 1.0
**Status**: ✅ Production Ready
