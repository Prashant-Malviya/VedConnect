# VedConnect - Real-Time Chat Application

A full-stack, real-time chat application built on the MERN stack with TypeScript throughout. It supports JWT authentication, a shared Community chat, one-to-one direct messages, online presence, typing indicators, and message delivery status.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Recent Fixes](#recent-fixes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [REST API Reference](#rest-api-reference)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Socket.io Events](#socketio-events)
- [How to Test It End to End](#how-to-test-it-end-to-end)
- [Known Limitations / Trade-offs](#known-limitations--trade-offs)

---

## Features

- JWT-based signup/login, with passwords hashed via bcrypt
- Protected REST routes and a protected Socket.io connection
- A shared **Community** chat that every registered user automatically belongs to
- One-to-one **Direct Messages**, created lazily on the first message sent
- Real-time delivery via Socket.io (rooms per conversation, so private chats stay private)
- Online / offline presence, shown per user in the sidebar
- Typing indicators, scoped to the conversation you're currently viewing
- Join / leave notifications
- Message delivery status (Sent / Delivered - no read receipts)
- Auto-scroll to the latest message, message grouping, and date separators
- Fully responsive UI (desktop, tablet, mobile)

## Tech Stack

**Client:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Socket.io Client, React Toastify, Lucide Icons

**Server:** Node.js, Express, TypeScript, MongoDB, Mongoose, Socket.io, JWT, bcrypt

## Project Structure

```
VedConnect/
├── server/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Request/response handling only
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # The only layer that talks to MongoDB
│   │   ├── routes/         # Express route definitions
│   │   ├── models/         # Mongoose schemas (User, Conversation, Message)
│   │   ├── sockets/        # Connection, presence, rooms, typing - no business logic
│   │   ├── middleware/     # JWT auth + centralized error handling
│   │   ├── types/          # Shared TypeScript interfaces
│   │   ├── utils/          # AppError, response formatting
│   │   ├── app.ts          # Express app wiring
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/     # Sidebar, ChatWindow, MessageList, etc.
│   │   ├── context/        # AuthContext (the app's one use of Context)
│   │   ├── pages/          # Home, About, Contact, Signup, Login, Chat
│   │   ├── services/       # Axios calls (api.ts, auth.api.ts)
│   │   ├── sockets/        # Shared socket.io-client instance
│   │   ├── types/          # Shared TypeScript interfaces
│   │   ├── utils/          # Avatar color hashing
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Architecture

REST APIs are the source of truth for data (auth, users, conversations, message history, sending a message). Socket.io is used only for real-time delivery on top of that: broadcasting new messages, presence, and typing.

```
Client
  |
  v
POST /api/messages   (JWT required)
  |
  v
Controller -> Service -> Repository -> MongoDB
  |
  v
Broadcast to the conversation's Socket.io room -> every participant's open tabs
```

**Conversations are the core model.** Every message belongs to a Conversation, which is either:

- `type: "group"` - the single shared **Community** conversation, or
- `type: "private"` - a 1-to-1 chat between exactly two participants

Every conversation is also a Socket.io *room*, named after its `_id`. Broadcasting a message to `io.to(conversationId)` (instead of `io.emit()` to everyone) is what keeps private chats private and scopes Community to its own room.

### Backend layers

- **routes/** - Express endpoint definitions
- **controllers/** - request/response handling only
- **services/** - business logic, validation, and the Community self-healing logic (see below)
- **repositories/** - the only layer that queries MongoDB directly
- **sockets/** - connection, disconnection, presence tracking, room membership, typing relay - no business logic
- **middleware/** - `authenticate` (JWT verification) and a centralized error handler built around a small `AppError` class

---

## Recent Fixes

This project was audited and the following issues were fixed:

### 1. "No conversation selected" after wiping the database

**Symptom:** After clearing the database, clicking on any user or on Community in the sidebar did nothing - the chat window just showed *"No conversation selected. Pick Community or a user to start chatting."*

**Root causes (two, compounding):**

1. **Frontend:** `ChatPage.tsx` had a guard - `if (!users.length || !conversations.length) return;` - around the logic that resolves the selected chat from the URL. When the database was wiped, `conversations` was legitimately empty, so this guard caused the effect to bail out immediately, no matter what you clicked. Private chats don't actually need any conversation to exist yet (a "pending" chat is a supported state), so this guard was wrong to include `conversations.length` at all.

2. **Backend:** The shared **Community** conversation is normally created once, at server startup (`ensureCommunityConversation()` in `server.ts`). If the database was wiped *while the server kept running* (no restart), that conversation document was gone, and `addUserToCommunity()` (called on signup) silently did nothing if it couldn't find Community - it never recreated it. So Community stayed permanently missing until the next server restart.

**Fix:**

- The frontend guard now only depends on `users.length` (needed to resolve `/chat/:username` routes), not on `conversations.length`. Selecting a user or Community no longer requires any conversation to already exist.
- The backend is now self-healing: `addUserToCommunity()` recreates the Community conversation if it's missing, instead of silently returning. This function is also now called every time `GET /api/conversations` is hit (`listConversationsForUser`), so **any** request for the sidebar's conversation list re-guarantees that Community exists and that the current user is a participant - with no server restart required.

### 2. Auto-scroll to the latest message was disabled

While reviewing `MessageList.tsx`, the `useEffect` responsible for scrolling to the latest message on arrival was commented out (dead code), so new messages didn't bring the view to the bottom automatically. This has been restored.

### 3. Comment cleanup

Long, essay-style comments throughout both `server/src` and `client/src` were trimmed down to short, single-line notes - kept only where they explain something non-obvious (e.g. *why* a room-based broadcast is used, or *why* a guard exists), and removed everywhere they just repeated what the code already says.

### 4. Sending a message scrolled the whole page, not just the chat

**Symptom:** Clicking Send (or opening a conversation with existing history) sometimes scrolled the entire browser window instead of just the message list.

**Root cause:** `MessageList` auto-scrolled by calling `scrollIntoView()` on an empty div at the bottom of the list. `scrollIntoView()` asks the browser to walk up and find "the nearest scrollable ancestor" on its own - and the message list's container was missing `min-h-0`. Without it, a `flex-1` child inside a fixed-height flex column refuses to shrink to fit; it grows to fit *all* messages instead of clipping to the available space, so there was nothing to actually scroll internally, and the browser fell back to scrolling the page.

**Fix:** `MessageList` now scrolls itself directly (`container.scrollTop = container.scrollHeight` on a ref to its own container) instead of relying on `scrollIntoView()`'s ancestor search, and `min-h-0` was added to both the message list and the sidebar's Direct Messages list so they're properly height-constrained and scroll internally.

### 5. `.env.example` had a broken `JWT_EXPIRES_IN`

`server/.env.example` had its contents duplicated and set `JWT_EXPIRES_IN=providedays`, which isn't a valid duration string - `jsonwebtoken` throws on it, so login/signup would fail for anyone who copied the file as-is. Fixed to `JWT_EXPIRES_IN=7d`.

### 6. Added a global 404 handler and process-level crash logging

Unmatched routes previously fell through to Express's default (unbranded, non-JSON) 404 page instead of the app's standard `{ success: false, message }` shape. An unhandled promise rejection outside a request (e.g. a fire-and-forget async call) would also have crashed the process with no log output. Both are now handled explicitly - see `notFoundHandler` in `app.ts` and the `process.on(...)` handlers in `server.ts`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local, or a free MongoDB Atlas cluster)

### 1. Backend

```bash
cd server
cp .env.example .env
# Set a real JWT_SECRET and your MongoDB URI in .env
npm install
npm run dev
```

Runs on `http://localhost:5000` by default.

### 2. Frontend

In a separate terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

---

## Environment Variables

### `server/.env`

| Variable         | Description                                  | Example                                |
|------------------|-----------------------------------------------|-----------------------------------------|
| `PORT`           | Port the API server listens on               | `5000`                                  |
| `MONGODB_URI`    | MongoDB connection string                     | `mongodb://localhost:27017/chat-app`   |
| `CLIENT_URL`     | Frontend origin, used for CORS                | `http://localhost:5173`                |
| `JWT_SECRET`     | Secret used to sign/verify JWTs               | a long random string                    |
| `JWT_EXPIRES_IN` | How long a JWT stays valid                    | `7d`                                     |

### `client/.env`

| Variable            | Description                    | Example                          |
|---------------------|---------------------------------|-----------------------------------|
| `VITE_API_URL`      | Base URL for REST API calls    | `http://localhost:5000/api`      |
| `VITE_SOCKET_URL`   | Base URL for the Socket.io connection | `http://localhost:5000`   |

---

## REST API Reference

All responses share the same shape:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

### Auth

| Method | Endpoint           | Auth required | Description                          |
|--------|--------------------|:--------------:|----------------------------------------|
| POST   | `/api/auth/signup` | No             | Create an account (adds user to Community) |
| POST   | `/api/auth/login`  | No             | Log in, returns a JWT                  |
| GET    | `/api/auth/me`     | Yes            | Get the current logged-in user         |

### Users

| Method | Endpoint      | Auth required | Description                             |
|--------|---------------|:--------------:|-------------------------------------------|
| GET    | `/api/users`  | Yes            | Every registered user except yourself   |

### Conversations

| Method | Endpoint                              | Auth required | Description                                      |
|--------|----------------------------------------|:--------------:|-----------------------------------------------------|
| GET    | `/api/conversations`                  | Yes            | Every conversation you belong to (Community + DMs) |
| GET    | `/api/conversations/:id/messages`     | Yes            | Full message history for one conversation          |

### Messages

| Method | Endpoint         | Auth required | Description                                                |
|--------|------------------|:--------------:|----------------------------------------------------------------|
| POST   | `/api/messages` | Yes            | Send a message. Body needs either `conversationId` **or** `receiverId` (first message to someone new) |

Auth is passed as `Authorization: Bearer <token>`.

---

## API Documentation (Swagger)

Every route above is also described by a single OpenAPI 3.0 spec at `server/src/docs/openapi.json`, served two ways:

- **`GET /api/docs`** - a live Swagger UI. Click **Authorize**, paste a JWT from `POST /api/auth/login`, and every route can be called directly from the browser with "Try it out".
- **`GET /api/docs.json`** - the raw spec. In Postman: **Import → Link**, paste `http://localhost:5000/api/docs.json`, and every endpoint above is imported as a ready-to-use request with example bodies.

The frontend also has its own page at **`/api-docs`** (linked from the navbar) that embeds the same Swagger UI plus a quick-reference table, so it's reachable without knowing the backend's port.

---

## Socket.io Events

Connecting requires a JWT: `io(SOCKET_URL, { auth: { token } })`.

### Client -> Server

| Event               | Payload                       | Description                          |
|----------------------|--------------------------------|----------------------------------------|
| `joinConversation`   | `conversationId: string`      | Explicitly join a conversation's room |
| `leaveConversation`  | `conversationId: string`      | Leave a conversation's room           |
| `typing`             | `{ conversationId }`          | Notify others you're typing            |
| `stopTyping`         | `{ conversationId }`          | Notify others you've stopped           |

### Server -> Client

| Event                  | Payload                                              | Description                              |
|-------------------------|-------------------------------------------------------|---------------------------------------------|
| `newMessage`           | `Message`                                             | A new message in a room you're in          |
| `messageStatusUpdate`  | `{ messageId, status, conversationId }`              | A message flipped from `sent` to `delivered` |
| `onlineUsers`          | `OnlineUser[]`                                        | The current list of online users            |
| `userTyping`           | `{ username, conversationId }`                       | Someone started typing in a room you're in |
| `userStopTyping`       | `{ username, conversationId }`                       | Someone stopped typing                      |
| `notification`         | `{ message }`                                         | Join/leave text, e.g. "X joined the chat"  |

---

## How to Test It End to End

1. Start the backend and frontend (see [Getting Started](#getting-started)).
2. Sign up as **User A** in one browser, and **User B** in a second browser (or an incognito window).
3. Log in as both.
4. Open **Community** in each - send a message from one, watch it appear instantly in the other.
5. Open a **Direct Message** with the other user (no conversation exists yet) - send the first message, and confirm it now shows up under Direct Messages with a last-message preview in the sidebar.
6. Confirm: online status in the sidebar updates live, typing shows "X is typing...", join/leave notifications appear, and your own messages show "Sent" then flip to "Delivered" once the other user is online.
7. To specifically verify the DB-wipe fix: clear every collection in MongoDB while the server keeps running (no restart), then log in again (or refresh) and click Community or any user. It should work immediately - Community is recreated and you're re-added to it automatically on the next conversation fetch.

---

## Known Limitations / Trade-offs

- **No refresh tokens.** JWTs are simple, with a 7-day expiry by default, stored in `localStorage`. Fine for this scale of app; a production system would want shorter-lived tokens plus a refresh flow.
- **In-memory presence.** Online users and typing state live in a `Map` on the server process. This resets on restart and won't scale across multiple server instances without something like Redis pub/sub.
- **No read receipts.** "Delivered" just means another participant was online the moment the message was sent - there's no per-user "seen" tracking.
- **No image/file uploads.** Avatars are generated (first letter of the name, on a color hashed from the username) rather than uploaded.
