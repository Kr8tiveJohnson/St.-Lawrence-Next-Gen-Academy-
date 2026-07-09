# Database Schema Overview — St. Lawrence Next Gen Academy

## Core Tables
- **users** — id, email, passwordHash, role, accountStatus, createdAt
- **profiles** — userId(FK), country, state, photoUrl, photoStatus, photoVisibility, examFocus, tier
- **friend_requests** — id, senderId(FK), receiverId(FK), status, createdAt

## Content Tables
- **news_posts** — id, category, title, body, publishedAt, authorId(FK)
- **hall_of_fame** — id, studentId(FK), story, photoUrl, featuredAt
- **exam_types** — id, name (WAEC/JAMB/NECO/GCE)
- **subjects** — id, name, examTypeId(FK)
- **years** — id, year, subjectId(FK)
- **batches** — id, name, yearId(FK)
- **questions** — id, text, answer, explanation, batchId(FK), accessTier
- **bookmarks** — userId(FK), questionId(FK), reviewed, createdAt

## Classroom & Course Tables
- **courses** — id, title, description, accessTier
- **lessons** — id, title, videoUrl, courseId(FK), accessTier
- **video_progress** — userId(FK), lessonId(FK), resumePosition, completedAt
- **classrooms** — id, name, type, createdBy(FK), enrollmentCap, accessTier
- **enrollments** — classroomId(FK), userId(FK), grantedBy(FK)

## Social & Chat Tables
- **groups** — id, name, createdBy(FK), grantedBy(FK), accessType
- **group_members** — groupId(FK), userId(FK)
- **chat_rooms** — id, type, retentionDays, createdBy(FK)
- **messages** — id, roomId(FK), senderId(FK), content, sentAt, expiresAt

## Financial & Admin Tables
- **transactions** — id, userId(FK), type, amount, provider, status, paidAt
- **membership_status** — userId(FK), tier, adFree, expiresAt
- **admin_overrides** — id, userId(FK), grantedBy(FK), permission, reason, grantedAt, revokedAt
- **audit_logs** — id, actorId(FK), action, targetId, metadata(JSON), timestamp
- **social_links** — id, platform, url, displayOrder
- **ad_config** — id, slotName, provider, scriptTag, active

> Full ERD (Entity Relationship Diagram) to be generated with Prisma or drawn separately.
