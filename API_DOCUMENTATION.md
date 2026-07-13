# St. Lawrence Next Gen Academy - Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

Tokens are obtained from the login endpoint and valid for 7 days.

---

## 1. AUTH ENDPOINTS

### Register
```
POST /auth/register
Body: {
  email: string,
  password: string,
  fullName?: string,
  phone?: string,
  dateOfBirth?: string (ISO date)
}
Response: { user: User, token: string }
```

### Login
```
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: { user: User, token: string }
```

### Get Current User
```
GET /auth/me (requires auth)
Response: { user: User }
```

---

## 2. USER ENDPOINTS

### Get Current User Profile
```
GET /users/me (requires auth)
Response: { user: User }
```

### Update Profile
```
PUT /users/me (requires auth)
Body: {
  fullName?: string,
  phone?: string,
  dateOfBirth?: string
}
Response: { user: User }
```

### Upload Photo
```
POST /users/me/photo (requires auth)
Body: {
  avatarUrl: string (URL to image)
}
Response: { profile: Profile }
```

### Update Privacy Settings
```
PUT /users/me/privacy (requires auth)
Body: {
  settings: {
    [key: string]: boolean  // e.g., { "show_email": false }
  }
}
Response: { overrides: PermissionOverride[] }
```

### Get User by ID
```
GET /users/:id (requires auth)
Response: { user: User } (sanitized based on permissions)
```

---

## 3. GROUP ENDPOINTS

### Get All Groups (public)
```
GET /groups
Response: { groups: Group[] }
```

### Get Group by ID
```
GET /groups/:id (requires auth)
Response: { group: GroupWithMembers }
```

### Create Group (teacher+ required)
```
POST /groups (requires auth)
Body: {
  name: string,
  description?: string
}
Response: { group: Group }
```

### Join Group
```
POST /groups/:id/join (requires auth)
Response: { enrollment: Enrollment }
```

### Leave Group
```
DELETE /groups/:id/leave (requires auth)
Response: { message: string }
```

### Update Group (admin required)
```
PUT /groups/:id (requires auth + admin)
Body: {
  name?: string,
  description?: string
}
Response: { group: Group }
```

### Delete Group (admin required)
```
DELETE /groups/:id (requires auth + admin)
Response: { message: string }
```

---

## 4. CLASSROOM ENDPOINTS

### Get All Classrooms (public)
```
GET /classrooms
Response: { classrooms: Classroom[] }
```

### Get Classroom by ID (public)
```
GET /classrooms/:id
Response: { classroom: ClassroomWithLessons }
```

### Create Classroom (teacher+ required)
```
POST /classrooms (requires auth)
Body: {
  title: string,
  category: string,
  subject: string,
  isPaid?: boolean
}
Response: { classroom: Classroom }
```

### Update Classroom (teacher+ required)
```
PUT /classrooms/:id (requires auth)
Body: {
  title?: string,
  category?: string,
  subject?: string,
  isPaid?: boolean
}
Response: { classroom: ClassroomWithLessons }
```

### Get Video URL for Lesson
```
GET /classrooms/:classroomId/video/:lessonId (requires auth)
Response: { videoUrl: string, type: string }
```

### Update Progress
```
POST /classrooms/:classroomId/progress (requires auth)
Body: {
  lessonId: string,
  progress: number (0-100)
}
Response: { message: string, data: ProgressData }
```

### Delete Classroom (admin required)
```
DELETE /classrooms/:id (requires auth + admin)
Response: { message: string }
```

---

## 5. CHAT ENDPOINTS

All chat endpoints require authentication.

### Get All Chat Rooms
```
GET /chat/rooms
Response: { rooms: ChatRoom[] }
```

### Get Messages in Room
```
GET /chat/rooms/:userId/messages?limit=50&offset=0
Response: { messages: Message[] }
```

### Send Message
```
POST /chat/messages (requires auth)
Body: {
  receiverId: string,
  content: string,
  type?: string (default: "DIRECT")
}
Response: { message: Message }
```

### Report Message
```
POST /chat/messages/:messageId/report (requires auth)
Body: {
  reason: string
}
Response: { message: string }
```

---

## 6. NEWS ENDPOINTS

### Get All News (public)
```
GET /news
Response: { news: News[] }
```

### Get News by ID (public)
```
GET /news/:id
Response: { news: News }
```

### Get Hall of Fame (public)
```
GET /news/hall-of-fame/entries
Response: { entries: NewsEntry[] }
```

### Create News (admin required)
```
POST /news (requires auth + admin)
Body: {
  title: string,
  summary: string,
  details: string,
  tag?: string
}
Response: { news: News }
```

### Update News (admin required)
```
PUT /news/:id (requires auth + admin)
Body: {
  title?: string,
  summary?: string,
  details?: string,
  tag?: string
}
Response: { news: News }
```

### Delete News (admin required)
```
DELETE /news/:id (requires auth + admin)
Response: { message: string }
```

### Add Hall of Fame Entry (admin required)
```
POST /news/hall-of-fame/add (requires auth + admin)
Body: {
  title: string,
  summary: string,
  details?: string
}
Response: { entry: News }
```

---

## 7. PAST QUESTIONS ENDPOINTS

### Get All Questions (public)
```
GET /questions?examType=JAMB&subject=English&year=2023
Response: { questions: Question[] }
```

### Search Questions (public)
```
GET /questions/search?q=biology&examType=JAMB&subject=Science
Response: { questions: Question[] }
```

### Get Question by ID (public)
```
GET /questions/:id
Response: { question: Question }
```

### Bookmark Question
```
POST /questions/:id/bookmark (requires auth)
Response: { bookmark: Bookmark }
```

### Remove Bookmark
```
DELETE /questions/:id/bookmark (requires auth)
Response: { message: string }
```

### Get User's Bookmarks
```
GET /questions/bookmarks/my (requires auth)
Response: { bookmarks: Bookmark[] }
```

### Create Question (admin required)
```
POST /questions (requires auth + admin)
Body: {
  examType: string,
  subject: string,
  year: number,
  questionText: string,
  options: Json,
  correctOption: string,
  isPaid?: boolean
}
Response: { question: Question }
```

---

## 8. FRIEND ENDPOINTS

All friend endpoints require authentication.

### Get Friends List
```
GET /friends
Response: { friends: User[] }
```

### Get Pending Requests
```
GET /friends/requests/pending
Response: { requests: FriendRequest[] }
```

### Send Friend Request
```
POST /friends/request
Body: {
  receiverId: string
}
Response: { friendship: Friendship }
```

### Accept Friend Request
```
PUT /friends/:id/accept
Response: { friendship: Friendship }
```

### Reject/Unfriend
```
PUT /friends/:id/reject
Response: { message: string }
```

---

## 9. ADMIN ENDPOINTS

All admin endpoints require ADMIN role.

### Get Dashboard Stats
```
GET /admin/stats (requires auth + admin)
Response: { stats: DashboardStats }
```

### Get All Users
```
GET /admin/users?role=TEACHER&tier=PAID&limit=50&offset=0 (requires auth + admin)
Response: { users: User[], total: number, limit: number, offset: number }
```

### Update User Role/Tier
```
PUT /admin/users/:id/role (requires auth + admin)
Body: {
  role?: string,
  tier?: string
}
Response: { user: User }
```

### Delete User
```
DELETE /admin/users/:id (requires auth + admin)
Response: { message: string }
```

### Get Classroom Activity
```
GET /admin/classrooms/activity (requires auth + admin)
Response: { classrooms: Classroom[] }
```

### Get Audit Logs
```
GET /admin/logs?limit=100&offset=0 (requires auth + admin)
Response: { logs: AuditLog[] }
```

### Get Ad Settings
```
GET /admin/ads/settings (requires auth + admin)
Response: { settings: AdSetting[] }
```

### Manage Ad Settings
```
POST /admin/ads/settings (requires auth + admin)
Body: {
  slot: string,
  clientId?: string,
  isActive?: boolean,
  price?: number
}
Response: { setting: AdSetting }
```

---

## 10. PAYMENT ENDPOINTS

### Initialize Checkout
```
POST /payments/checkout (requires auth)
Body: {
  amount: number,
  type: string (e.g., "premium_access"),
  provider: string (e.g., "paystack")
}
Response: { redirectUrl: string, reference: string }
```

### Payment Webhook
```
POST /payments/webhook (public)
Body: (varies by provider - Paystack/Flutterwave payload)
Response: { message: string }
```

### Toggle Ad-Free
```
PUT /payments/ad-free/toggle (requires auth + paid user)
Response: { adFree: boolean }
```

### Get Payment History
```
GET /payments/history (requires auth)
Response: { payments: Payment[] }
```

---

## 11. ANALYTICS ENDPOINTS

All analytics endpoints require authentication.

### Get Active Users
```
GET /analytics/active-users?days=30
Response: { activeUsers: number, days: number, period: string }
```

### Get Popular Subjects
```
GET /analytics/popular-subjects
Response: { popular: Subject[] }
```

### Get Engagement Metrics
```
GET /analytics/engagement
Response: { metrics: EngagementMetrics }
```

### Get Revenue (admin required)
```
GET /analytics/revenue?days=30 (requires auth + admin)
Response: { paidUsers: number, estimatedRevenue: number, currency: string }
```

---

## Data Models

### User
```javascript
{
  id: string,
  email: string,
  role: "STUDENT" | "TEACHER" | "ADMIN" | "MAIN_ADMIN",
  tier: "PUBLIC" | "UNPAID" | "PAID",
  profile: Profile,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Profile
```javascript
{
  id: string,
  fullName?: string,
  phone?: string,
  dateOfBirth?: datetime,
  avatarUrl?: string,
  userId: string
}
```

### Group
```javascript
{
  id: string,
  name: string,
  description?: string,
  createdAt: datetime
}
```

### Classroom/Course
```javascript
{
  id: string,
  title: string,
  category: string,
  subject: string,
  isPaid: boolean,
  lessons: Lesson[]
}
```

### Message
```javascript
{
  id: string,
  content: string,
  type: string,
  createdAt: datetime,
  senderId: string,
  receiverId: string,
  sender: User,
  receiver: User
}
```

### Friendship
```javascript
{
  id: string,
  status: "PENDING" | "ACCEPTED" | "BLOCKED",
  createdAt: datetime,
  requesterId: string,
  receiverId: string,
  requester: User,
  receiver: User
}
```

---

## Error Handling

All endpoints return error responses in this format:
```javascript
{
  error: string,
  timestamp: datetime
}
```

Common HTTP status codes:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting & Best Practices

1. **Authentication**: Store tokens securely (httpOnly cookies or secure localStorage)
2. **Token Refresh**: Tokens expire after 7 days
3. **Pagination**: Use `limit` and `offset` for large datasets
4. **Filtering**: Use query parameters for filtering (e.g., `?role=TEACHER`)
5. **Error Handling**: Always check for error responses before processing data

---

## Frontend Integration Examples

### React Hook Example
```javascript
// Fetch classrooms
const [classrooms, setClassrooms] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/api/classrooms')
    .then(res => res.json())
    .then(data => setClassrooms(data.classrooms));
}, []);
```

### With Authentication
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data.user));
```

---

## Next Steps for Frontend

1. Update API client configuration to use these endpoints
2. Replace hardcoded mock data with real API calls
3. Implement token management and refresh logic
4. Add loading states and error handling
5. Set up Redux/Context stores to manage API data
6. Test all endpoints with Postman or similar tool
