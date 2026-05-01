# 📚 Redify — Full Project Documentation

> A full-stack digital book reading platform. Read real public domain classics, manage your library, and explore books by category — all in one place.

---

## Table of Contents

1. [What is Redify?](#1-what-is-redify)
2. [Why Was It Built?](#2-why-was-it-built)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [How to Run the Project](#5-how-to-run-the-project)
6. [Frontend — Pages & Components](#6-frontend--pages--components)
7. [Backend — API Reference](#7-backend--api-reference)
8. [Database Models](#8-database-models)
9. [Authentication & Security](#9-authentication--security)
10. [Admin Panel](#10-admin-panel)
11. [Book Import System](#11-book-import-system)
12. [Routes Reference](#12-routes-reference)
13. [Known Limitations & Future Improvements](#13-known-limitations--future-improvements)

---

## 1. What is Redify?

**Redify** is a full-stack web application that works like a personal digital library. Users can:

- 🏠 **Browse** books on the home page, sorted by category
- 📖 **Read** full books directly in the browser with a rich reading UI
- 🔍 **Search** for books by title or author
- 🗂️ **Filter** books by genre/category
- ⭐ **Save** favorites and add reading notes
- 📊 **Track** their reading activity on a personal dashboard
- 👤 **Manage** their profile and account settings

Admins additionally can:
- ➕ Add, edit, and delete books
- 👥 Manage users and change their roles
- 🏷️ Add/remove categories that appear on the home page

---

## 2. Why Was It Built?

Redify was built to demonstrate a complete, production-like full-stack web application using modern JavaScript technologies. The project covers:

- **Frontend engineering** — React components, routing, state management, theming
- **Backend engineering** — REST API design with Express.js
- **Database design** — Relational data modeling with Sequelize ORM
- **Security** — Password hashing with bcrypt, role-based access control
- **UX/UI** — Dark/light mode, responsive design, animations
- **Content** — Real readable books fetched from Project Gutenberg (public domain)

---

## 3. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library — component-based architecture |
| **React Router v6** | Client-side page routing |
| **Tailwind CSS** | Utility-first CSS styling |
| **Vite** | Development server and bundler |
| **Lucide React** | Icon library |
| **Context API** | Global state (auth, theme) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | HTTP server and REST API framework |
| **Sequelize ORM** | Database abstraction layer |
| **SQLite** | Lightweight file-based relational database |
| **bcrypt** | Password hashing and verification |

---

## 4. Project Structure

```
Redify/
│
├── index.html                  # App entry point (sets browser tab title)
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Frontend dependencies
│
├── public/                     # Static assets (favicon, etc.)
│
├── src/                        # All React frontend code
│   ├── main.jsx                # React app bootstrapper
│   ├── App.jsx                 # Route definitions
│   ├── index.css               # Global CSS variables and base styles
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # User login state (global)
│   │   └── ThemeContext.jsx    # Dark/light mode state (global)
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Hero.jsx            # Homepage hero/banner section
│   │   ├── CategorySection.jsx # Dynamic genre grid on homepage
│   │   ├── BookSection.jsx     # Horizontal scrollable book row
│   │   ├── BookCard.jsx        # Individual book card with hover buttons
│   │   ├── Footer.jsx          # Site footer
│   │   └── AdminLayout.jsx     # Admin panel sidebar + layout wrapper
│   │
│   └── pages/
│       ├── HomePage.jsx        # Main landing page
│       ├── LoginPage.jsx       # Login + Register + Google auth UI
│       ├── BookDetails.jsx     # Full book info, reviews, recommendations
│       ├── ReadingPage.jsx     # In-browser book reader
│       ├── Dashboard.jsx       # User reading stats and notes
│       ├── ProfilePage.jsx     # Account settings and profile editing
│       └── admin/
│           ├── AdminDashboard.jsx    # Admin stats overview
│           ├── AdminUsers.jsx        # User management table
│           ├── AdminBooks.jsx        # Book management (add/edit/delete)
│           └── AdminCategories.jsx   # Category management
│
└── server/                     # All Node.js backend code
    ├── index.js                # Express server — all API routes
    ├── db.js                   # Sequelize models and database connection
    ├── database.sqlite         # SQLite database file (auto-created)
    ├── seed.js                 # Initial dummy data seeder
    ├── seed_categories.js      # Category + book seeder
    ├── fetch_gutenberg.js      # Fetch books from Project Gutenberg
    ├── import_real_books.js    # Full real book import script
    └── package.json            # Backend dependencies
```

---

## 5. How to Run the Project

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Step 1 — Install frontend dependencies
```bash
cd Redify
npm install
```

### Step 2 — Install backend dependencies
```bash
cd server
npm install
```

### Step 3 — Start the backend server
```bash
cd server
node index.js
```
> Server runs at: `http://localhost:5000`
> The SQLite database is auto-created on first run.

### Step 4 — Start the frontend dev server
```bash
# In the root Redify/ directory
npm run dev
```
> App runs at: `http://localhost:5173`

### Step 5 — (First time only) Import real books
```bash
cd server
node import_real_books.js
```
> This fetches 29 real books from Project Gutenberg with full readable content.

---

## 6. Frontend — Pages & Components

### Pages

#### `HomePage.jsx`
The main landing page. Displays:
- **Hero section** with live book/category counts from the API
- **Category grid** — fetched dynamically from the database
- **Book sections** — "For You", "Trending Now", "New Releases" — all from the API
- **URL-based filtering** — `/?search=query` and `/?category=genre` both work

#### `LoginPage.jsx`
Handles both login and registration in a single page. Features:
- Toggle between Sign In / Create Account
- Email/password form with validation
- Google OAuth simulation (mock Google account picker)
- After login → redirects to Home page

#### `BookDetails.jsx`
Shows full information for a single book:
- Cover image, author, rating, description
- Book info table (pages, publisher, year, language)
- Reader reviews section
- "You May Also Enjoy" recommendations (same genre)
- "Start Reading" button

#### `ReadingPage.jsx`
The full in-browser book reader:
- **Left sidebar**: Chapter list + notes panel
- **Main area**: Paginated book content
- **Header controls**: Font size (A-/A+), light/dark/sepia themes, bookmarks
- Automatically logs the reading session for streak tracking
- Notes are saved to the database per user

#### `Dashboard.jsx`
Personal reading dashboard showing:
- Reading streak, books read, notes count
- Weekly activity calendar
- Recent notes
- Last read book shortcut

#### `ProfilePage.jsx`
Account management — edit name, email, bio, and avatar.

### Components

#### `Navbar.jsx`
- Fixed top navigation with theme-aware styles (light/dark)
- Search bar navigates via `?search=` parameter
- User menu dropdown (Dashboard, Profile, Admin Panel, Sign Out)
- Fully responsive with mobile hamburger menu

#### `Hero.jsx`
- Animated headline with gradient text
- Live stats: real book count and category count from API
- "Start Reading" → goes to reader (or login if not logged in)
- "Explore Books" → smooth scrolls to category section

#### `CategorySection.jsx`
- Fetches all categories from `/api/categories` — fully dynamic
- Maps each category name to a matching icon and color
- Unknown/custom categories get a default Tag icon
- Clicking a category → filters homepage via `?category=` URL

#### `BookCard.jsx`
- Hover overlay with "Read Now" and "Details" buttons
- Bookmark icon, star rating, genre tag

#### `AdminLayout.jsx`
- Sidebar with navigation links
- "Back to Site" link
- Wraps all admin pages

---

## 7. Backend — API Reference

### Public Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/books` | Get all books |
| `GET` | `/api/books/:id` | Get single book with reviews |
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/login` | Login with email + password |
| `POST` | `/api/register` | Create new account |
| `POST` | `/api/google-login` | Login or register via Google |

### User Routes

| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/user/:id` | Update profile |
| `GET` | `/api/user-profile/:id` | Get user profile + stats |
| `GET` | `/api/dashboard-stats/:id` | Get reading streak + weekly activity |
| `POST` | `/api/user/:id/read-log` | Log a reading session |
| `GET` | `/api/notes/:userId` | Get all notes for a user |
| `POST` | `/api/notes` | Save a new note |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Admin Routes (require `user-id` header with Admin role)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard stats |
| `GET` | `/api/admin/users` | List all users |
| `PUT` | `/api/admin/users/:id/role` | Change user role |
| `DELETE` | `/api/admin/users/:id` | Delete a user |
| `GET` | `/api/admin/books` | List all books |
| `POST` | `/api/admin/books` | Add a new book |
| `PUT` | `/api/admin/books/:id` | Edit a book |
| `DELETE` | `/api/admin/books/:id` | Delete a book |
| `GET` | `/api/admin/categories` | List all categories |
| `POST` | `/api/admin/categories` | Add a category |
| `PUT` | `/api/admin/categories/:id` | Edit a category |
| `DELETE` | `/api/admin/categories/:id` | Delete a category |

---

## 8. Database Models

### `User`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `name` | String | Display name |
| `email` | String (unique) | Login identifier |
| `password` | String | bcrypt hashed |
| `avatar` | String | URL or base64 |
| `bio` | Text | Short biography |
| `role` | String | `Reader` or `Admin` |

### `Book`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `title` | String | Book title |
| `author` | String | Author name |
| `description` | Text | Synopsis |
| `coverUrl` | String | Image URL |
| `genre` | String | e.g. Fiction, Sci-Fi |
| `category` | String | Matches Category table |
| `rating` | Float | Star rating |
| `reviewsCount` | Integer | Review count |
| `pages` | Integer | Page count |
| `publisher` | String | Publisher |
| `language` | String | Default: English |
| `publishedYear` | String | Year |
| `content` | JSON | `{ chapters, pages }` |

### `Category`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `name` | String (unique) | e.g. Fiction, Science |

### `Review`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `userName` | String | Reviewer name |
| `comment` | Text | Review text |
| `rating` | Integer | 1–5 stars |
| `BookId` | FK | → Book |

### `Note`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `content` | Text | Note text |
| `page` | Integer | Page number |
| `bookId` | Integer | Related book |
| `bookTitle` | String | Cached title |
| `UserId` | FK | → User |

### `ReadingLog`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `date` | DateOnly | YYYY-MM-DD |
| `UserId` | FK | → User |

---

## 9. Authentication & Security

### Login Flow
1. User submits email + password
2. Server finds user by email
3. If password is bcrypt hash → use `bcrypt.compare()`
4. If plain text (legacy) → compare directly, then **auto-upgrade to bcrypt hash**
5. On success → return user object → stored in `localStorage` via `AuthContext`

### Password Security
- **Algorithm**: bcrypt with 10 salt rounds
- All new registrations are hashed before saving
- Google OAuth users get a random hashed token (can't log in with password)

### Role-Based Access
- `isAdmin` middleware checks `user-id` request header
- Looks up user in DB and verifies `role === 'Admin'`
- Returns `401` (missing) or `403` (not admin) on failure
- Frontend `<AdminRoute>` component also blocks non-admins from admin pages

---

## 10. Admin Panel

### Access
1. Log in with an Admin account
2. Click username in top-right navbar → **Admin Panel**

### Default Credentials
| Email | Password |
|---|---|
| `redify@gmail.com` | `1234` |

### Features
- **Dashboard** — Live stats + recent users + recent books
- **Users** — View all users, change roles, delete accounts
- **Books** — Add/edit/delete books in the library
- **Categories** — Add/delete categories (reflected instantly on homepage)

---

## 11. Book Import System

Real books are sourced from **Project Gutenberg** — a free archive of public domain literature.

### How It Works
1. Books are defined with their Gutenberg ID number
2. Script fetches raw `.txt` from Gutenberg CDN
3. Header/footer boilerplate is stripped
4. Text is split into **chapters** (by "Chapter I", "Part II" etc.)
5. Chapters are split into ~1500 character **pages**
6. Result stored as `content: { chapters, pages }` JSON in SQLite
7. Books that fail parsing get a descriptive 3-page placeholder

### Run Import
```bash
cd server
node import_real_books.js
```
> ⚠️ This deletes all existing books before importing. Run only on a fresh database.

---

## 12. Routes Reference

| Path | Page | Auth Required |
|---|---|---|
| `/` | HomePage | No |
| `/login` | LoginPage | No |
| `/book/:id` | BookDetails | No |
| `/read` | Redirects to last book | No |
| `/read/:bookId` | ReadingPage | No |
| `/dashboard` | Dashboard | No |
| `/profile` | ProfilePage | No |
| `/admin` | AdminDashboard | Admin only |
| `/admin/users` | AdminUsers | Admin only |
| `/admin/books` | AdminBooks | Admin only |
| `/admin/categories` | AdminCategories | Admin only |

---

## 13. Known Limitations & Future Improvements

| Limitation | Recommendation |
|---|---|
| No JWT tokens | Replace localStorage auth with JWT |
| SQLite only | Migrate to PostgreSQL for production |
| No file uploads | Use Cloudinary/S3 for book covers |
| No email verification | Add Nodemailer/SendGrid |
| No reading progress save | Track page per user per book |
| Public domain only | Add PDF upload for custom books |

---

## Quick Reference

```bash
# Start backend
cd server && node index.js        # http://localhost:5000

# Start frontend
npm run dev                       # http://localhost:5173

# Import real books (once)
cd server && node import_real_books.js

# Admin login
Email:    redify@gmail.com
Password: 1234
```

---

*Redify v1.0 — Built with React + Express + SQLite*
