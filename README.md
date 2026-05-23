# CareerCopilot — AI Career Assistant (Frontend)

A personal AI career copilot that analyzes your resume, builds a personalized learning roadmap, and gives you an AI mentor that remembers your history.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | Frontend framework |
| Tailwind CSS v4 | Styling |
| React Router v7 | Client-side routing |
| Axios | API calls + JWT interceptor |
| Lucide React | Icons |
| Context API | Auth + Sidebar state |

---

## Project Structure

```
src/
├── api/
│   ├── axios.js           # Base Axios instance, Bearer token, 401 auto-logout
│   ├── auth.js            # signup, login, getMe
│   ├── profile.js         # getProfile, updateProfile
│   ├── resume.js          # uploadResume, getResumeAnalysis
│   ├── roadmap.js         # generateRoadmap, getRoadmap, toggleGoal
│   ├── chat.js            # sendMessage, getChatHistory, clearChatHistory
│   └── admin.js           # getStats, getUsers, getUserDetail, deleteUser, updateRole
│
├── context/
│   ├── AuthContext.jsx    # User state, login/logout, token persistence
│   └── SidebarContext.jsx # Collapsed/expanded state
│
├── components/
│   ├── DashboardLayout.jsx   # Sidebar + Header + AI Panel wrapper
│   ├── Sidebar.jsx           # Collapsible fixed left nav
│   ├── Header.jsx            # Sticky top bar with page title + user
│   ├── AiPanel.jsx           # Persistent right-side AI chat panel
│   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to /login
│   ├── AdminRoute.jsx        # Redirects non-admins to /dashboard
│   ├── LogoutModal.jsx       # Logout confirmation modal
│   ├── LoadingScreen.jsx     # Full screen loading spinner
│   └── AdminUserModal.jsx    # Admin user detail modal
│
├── pages/
│   ├── Landing.jsx           # Public landing page
│   ├── Signup.jsx            # Signup form
│   ├── Login.jsx             # Login form
│   ├── DashboardHome.jsx     # Dashboard overview
│   ├── ResumeAnalysis.jsx    # Resume upload + AI analysis results
│   ├── Roadmap.jsx           # Weekly roadmap with goal tracking
│   ├── Chat.jsx              # Full-page AI mentor chat
│   ├── Profile.jsx           # Profile editor
│   └── AdminDashboard.jsx    # Admin panel
│
├── mocks/
│   └── setup.js             # axios-mock-adapter (dev only, currently disabled)
│
├── App.jsx                  # All routes
├── main.jsx                 # Entry point
└── index.css                # Tailwind + custom scrollbar
```

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing | Public |
| `/signup` | Signup | Public |
| `/login` | Login | Public |
| `/dashboard` | Dashboard Home | Protected |
| `/dashboard/resume` | Resume Analysis | Protected |
| `/dashboard/roadmap` | Career Roadmap | Protected |
| `/dashboard/chat` | AI Mentor Chat | Protected |
| `/dashboard/profile` | My Profile | Protected |
| `/dashboard/admin` | Admin Panel | Admin only |

---

## Layout

```
┌──────────────┬──────────────────────────────────┬──────────────┐
│              │  Header (sticky, frosted glass)  │              │
│   Sidebar    ├──────────────────────────────────┤   AI Panel   │
│   w-64/w-16  │                                  │    w-80      │
│   (fixed)    │     Page Content (scrolls)       │   (fixed)    │
│  collapsible │                                  │              │
└──────────────┴──────────────────────────────────┴──────────────┘
```

- Sidebar collapses to icon-only (`w-16`) with smooth 300ms animation
- AI Panel is always visible — hidden only on `/dashboard/chat`
- Header is sticky with frosted glass blur effect

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variable

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

> Backend must be running at `http://localhost:3000`

### 4. Build for production

```bash
npm run build
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API base URL |

---

## Backend API Contract

Base URL: `http://localhost:3000/api`

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create account → returns JWT + user |
| POST | `/auth/login` | Login → returns JWT + user |
| GET | `/auth/me` | Get current user (must include `role`) |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| POST | `/resume/upload` | Upload PDF/DOCX (multipart, field: `resume`) |
| GET | `/resume/analysis` | Get latest resume analysis |

### Roadmap
| Method | Endpoint | Description |
|---|---|---|
| POST | `/roadmap/generate` | Generate AI roadmap from profile + resume |
| GET | `/roadmap` | Get current roadmap |
| PATCH | `/roadmap/goals/:id` | Toggle goal completed/incomplete |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/chat/history` | Get all messages |
| POST | `/chat/message` | Send `{ content }` → returns assistant reply |
| DELETE | `/chat/history` | Clear chat history |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Platform overview numbers |
| GET | `/admin/users` | All users with usage counts |
| GET | `/admin/users/:id` | Full user detail |
| DELETE | `/admin/users/:id` | Delete user and all their data |
| PATCH | `/admin/users/:id/role` | Update role `{ role: "admin" \| "user" }` |

---

## Admin Setup

Run this SQL in your database to make yourself admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Then log out and log back in — the **Admin Panel** link appears in the sidebar automatically.

---

## Dev Mock (Disabled)

A full mock API using `axios-mock-adapter` is in `src/mocks/setup.js`.
To re-enable for frontend-only development, add to `src/main.jsx`:

```js
if (import.meta.env.DEV) {
  await import('./mocks/setup.js')
}
```

Mock credentials: any email + any password (6+ chars).
