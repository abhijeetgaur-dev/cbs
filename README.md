# Content Broadcasting System

A modular Node.js API built designed to let teachers upload educational assets and have them publicly broadcasted sequentially based on time slots and principal approvals.

## Tech Stack
- **Node.js + Express**
- **Drizzle ORM** (talking to PostgreSQL)
- **Multer + AWS S3** (for image storage)
- **Zod** (for structural body validation mapping)
- **JWT / bcrypt** (for stateless roles mapping)

---

## Getting Started

1. **Clone & Install Dependencies**
```bash
npm install
```

2. **Setup your environment variables**
Copy over `.env.example`:
```bash
cp .env.example .env
```
Fill in the `DATABASE_URL` for PostgreSQL and provide your AWS IAM keys + S3 Bucket.

3. **Migrate the Database**
Because we define strict schemas in `/src/db/schema`, run:
```bash
npm run db:generate
npm run db:migrate
```

4. **Start the server**
```bash
npm run dev
```

---

## API Endpoints Overview

### Auth (Public)
| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Body `name`, `email`, `password`, `role ('teacher' or 'principal')` |
| `POST` | `/auth/login` | Body `email`, `password`. Returns JWT `Bearer [token]` |

### Teacher (Content)
| Method | Route | Description |
|---|---|---|
| `POST` | `/content/upload` | Form-Data: `file` (max 10MB), `title`, `subject`, `start_time` (optional ISO), `end_time` (optional ISO). Requires teacher JWT. |
| `GET` | `/content/my` | Returns all items uploaded by the currently authenticated teacher. |

### Principal (Approval)
| Method | Route | Description |
|---|---|---|
| `GET` | `/approval/pending` | Fetch all contents possessing the state of `pending`. |
| `GET` | `/approval/all` | Fetch absolutely all contents over the entire DB. |
| `PATCH` | `/approval/:contentId/approve` | Transitions the referenced content into an approved schedule rotation constraint. |
| `PATCH` | `/approval/:contentId/reject` | Body `rejection_reason`. Transitions state to rejected. |

### Public Broadcaster
| Method | Route | Description |
|---|---|---|
| `GET` | `/content/live/:teacherId` | The stateless broadcaster logic fetching the exactly current visible rotational content for the teacher's board. Can append `?subject=Math` as a query param. |

---

## Postman Structure & Implementation Notes
When testing through Postman:
1. Ensure your Auth folder sets up the `token` variable after the `/auth/login` test executes.
2. In the Approval endpoint (`/approve`), this relies on auto-generating a slot based on the `teacher` + `subject`. This effectively acts as the group. If the teacher uploads 3 different Math files, they all slide sequentially under a duration of 5 minutes based on the time since midnight. 

