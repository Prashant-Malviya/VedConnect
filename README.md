# 💬 VedConnect - Real-Time Chat Application

A production-ready real-time chat application built with the MERN Stack, TypeScript, and Socket.io. It supports secure authentication, one-to-one messaging, community chat, online presence, typing indicators, and message delivery status.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🚀 Frontend | https://ved-connect-wbg8.vercel.app/ |
| 🔗 Backend API | https://vedconnect-if8e.onrender.com |
| ❤️ Health Check | https://vedconnect-if8e.onrender.com/health |


---

## 🚀 Features

- 🔐 JWT Authentication (Signup/Login)
- 👤 Protected Routes
- 💬 Community Chat
- 📩 One-to-One Direct Messaging
- ⚡ Real-time Messaging using Socket.io
- 🟢 Online/Offline User Status
- ⌨️ Typing Indicators
- ✅ Message Delivery Status (Sent / Delivered)
- 🔍 Search Users
- 🎨 Responsive UI built with Tailwind CSS
- 🏗️ Layered Backend Architecture
- 🔒 Password Hashing using bcrypt

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.io Client
- Lucide React Icons

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication
- bcrypt

---

# 📁 Project Structure

```
VedConnect/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── types/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# 🏗️ Application Flow

```
Home
   │
   ▼
Signup
   │
   ▼
Login
   │
   ▼
Chat Dashboard
   │
   ├── Community Chat
   └── Direct Messages
```

---

# ⚙️ Architecture

REST APIs handle all database operations.

Socket.io is responsible only for real-time communication.

```
Frontend
     │
     ▼
Express API
     │
     ▼
Controllers
     │
     ▼
Services
     │
     ▼
Repositories
     │
     ▼
MongoDB

     │
     ▼
Socket.io
     │
     ▼
Connected Clients
```

---

# 📦 Backend Layers

### Routes

Defines API endpoints.

```
routes/
```

---

### Controllers

Handles request and response.

```
controllers/
```

---

### Services

Contains business logic.

```
services/
```

---

### Repositories

Responsible for database interaction.

```
repositories/
```

---

### Models

MongoDB schemas.

```
models/
```

---

### Middleware

- JWT Authentication
- Error Handling

---

### Socket

Handles

- User Connection
- User Disconnection
- Online Users
- Typing Events
- Real-time Messages

---

# 🔐 Authentication Flow

```
Signup
   │
   ▼
Password Hashing (bcrypt)
   │
   ▼
MongoDB
   │
   ▼
Login
   │
   ▼
JWT Token Generated
   │
   ▼
Stored in LocalStorage
   │
   ▼
Protected APIs & Socket Connection
```

---

# ⚡ Socket Events

## Client → Server

| Event | Description |
|--------|-------------|
| typing | User started typing |
| stopTyping | User stopped typing |
| joinConversation | Join conversation room |

---

## Server → Client

| Event | Description |
|--------|-------------|
| newMessage | Receive new message |
| onlineUsers | Online users list |
| userTyping | Typing indicator |
| userStopTyping | Stop typing indicator |
| messageStatusUpdate | Sent/Delivered status |
| notification | Join/Leave notifications |

---

# 📚 REST API

## Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

---

## Users

| Method | Endpoint |
|--------|----------|
| GET | `/api/users` |

---

## Conversations

| Method | Endpoint |
|--------|----------|
| GET | `/api/conversations` |

---

## Messages

| Method | Endpoint |
|--------|----------|
| GET | `/api/messages/:conversationId` |
| POST | `/api/messages` |

---

# 📋 API Response

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {}
}
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/VedConnect.git

cd VedConnect
```

---

## 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Run backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env`

```env
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
```

Run frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🧪 How to Test

1. Register User A.
2. Register User B in another browser/incognito.
3. Login with both users.
4. Open Community Chat.
5. Send messages.
6. Open Direct Messages.
7. Verify:

- Real-time messaging
- Online status
- Typing indicator
- Delivery status
- New conversation creation

---

# 🔒 Security

- Password hashing using bcrypt
- JWT Authentication
- Protected API routes
- Protected Socket connection
- Route Guards
- Input Validation

---

# 📈 Future Improvements

- Read Receipts
- Image Sharing
- File Uploads
- Emoji Picker
- Voice Messages
- Video Calling
- Group Management
- Push Notifications
- Redis for Socket Scaling
- Refresh Token Authentication

---

# 📄 License

This project is developed for learning purposes and technical assessment.

---

# 👨‍💻 Author

**Prashant Malviya**

- GitHub: https://github.com/Prashant-Malviya
- LinkedIn: https://www.linkedin.com/in/prashant-malviya-57270b1b6/
- Portfolio: https://prashantmalviya-portfolio.netlify.app
