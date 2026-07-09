# API Specification — St. Lawrence Next Gen Academy

## Base URL
`/api`

## Authentication
All protected routes require a Bearer token in the Authorization header.
Token is obtained from `POST /api/auth/login`.

## Endpoints Summary

### Auth  `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /login | None | Email + password login |
| POST | /register | None | New student registration |
| POST | /register/teacher | None | Teacher registration (goes to admin review) |
| POST | /forgot-password | None | Send password reset email |
| POST | /refresh-token | None | Refresh access token |

### Users  `/api/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /me | Registered | Own profile |
| PUT | /me | Registered | Update own profile |
| GET | /:id | Paid | View other member profile (privacy stripped) |
| POST | /me/photo | Registered | Upload photo (sets status to pending) |
| PUT | /me/privacy | Registered | Update photo visibility setting |

### Friends  `/api/friends`  (Paid, geo-gated)
| Method | Path | Description |
|---|---|---|
| POST | /request | Send friend request |
| PUT | /:id/accept | Accept request |
| PUT | /:id/reject | Reject request |
| GET | / | List friends |

### News  `/api/news`  (public read)
### Past Questions  `/api/questions`  (registered read)
### Classrooms  `/api/classrooms`  (registered/paid read)
### Groups  `/api/groups`  (paid)
### Chat  `/api/chat`  (paid)
### Payments  `/api/payments`
### Admin  `/api/admin`  (admin/super-admin)
### Analytics  `/api/analytics`  (admin only)

> Full endpoint details to be expanded during build phase.
