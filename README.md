
# 💬 VedConnect – Real-Time Chat Application

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socketdotio)](#)

A production-ready **real-time chat application** built using the **MERN Stack**, **TypeScript**, and **Socket.io**. The application supports secure JWT authentication, one-to-one messaging, a shared community chat, online presence, typing indicators, and real-time message delivery.

---

# 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🚀 Frontend | https://ved-connect-wbg8.vercel.app/ |
| 🔗 Backend API | https://vedconnect-if8e.onrender.com |
| ❤️ Health Check | https://vedconnect-if8e.onrender.com/health |

<img width="1919" height="1124" alt="VedConnect" src="https://github.com/user-attachments/assets/36abd679-c040-40b9-a7dc-38a46fccd881" />

---

# 📑 Table of Contents

- Features
- Tech Stack
- Architecture
- Project Structure
- Backend Layers
- Authentication Flow
- Socket Events
- REST API
- Installation
- Environment Variables
- Deployment
- Testing
- Security
- Future Improvements
- Author

---

# ✨ Features

- 🔐 JWT Authentication (Signup/Login)
- 🔒 Protected REST APIs
- 💬 Community Chat
- 👥 One-to-One Direct Messaging
- ⚡ Real-time Messaging with Socket.io
- 🟢 Online / Offline Presence
- ⌨️ Typing Indicators
- ✅ Message Delivery Status
- 🔍 User Search
- 📱 Responsive UI
- 🧱 Layered Backend Architecture
- 🔑 Password Hashing using bcrypt
- 🌍 Deployed on Vercel + Render

---

# 🛠 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.io Client
- Lucide React

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- Socket.io
- JWT
- bcrypt

---

# 🏗 Architecture

```
React Client (Vercel)
          │
          ▼
REST API (Express)
          │
          ▼
Controller
          │
          ▼
Service
          │
          ▼
Repository
          │
          ▼
MongoDB Atlas

          ▲
          │
Socket.io Server
          │
          ▼
Connected Clients
```

REST APIs are responsible for authentication, conversations and message persistence while Socket.io powers real-time communication.

---

# 📂 Project Structure

```
VedConnect/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
└── README.md
```

---

# 🧱 Backend Layers

- **Routes** – Define API endpoints
- **Controllers** – Handle HTTP requests & responses
- **Services** – Business logic
- **Repositories** – Database access
- **Models** – MongoDB schemas
- **Middleware** – JWT authentication & error handling
- **Sockets** – Real-time communication

---

# 🔐 Authentication Flow

```
Signup
   │
bcrypt Hash
   │
MongoDB
   │
Login
   │
JWT Token
   │
Protected APIs
   │
Socket Authentication
```

---

# ⚡ Socket Events

## Client → Server

- joinConversation
- leaveConversation
- typing
- stopTyping

## Server → Client

- newMessage
- onlineUsers
- userTyping
- userStopTyping
- messageStatusUpdate
- notification

---

# 📚 REST API

## Authentication

| Method | Endpoint |
|--------|----------|
| POST | /api/auth/signup |
| POST | /api/auth/login |
| GET | /api/auth/me |

## Users

| Method | Endpoint |
|--------|----------|
| GET | /api/users |

## Conversations

| Method | Endpoint |
|--------|----------|
| GET | /api/conversations |
| GET | /api/conversations/:id/messages |

## Messages

| Method | Endpoint |
|--------|----------|
| POST | /api/messages |

---

# ⚙️ Installation

## Clone

```bash
git clone https://github.com/Prashant-Malviya/VedConnect.git
cd VedConnect
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# 🌱 Environment Variables

## server/.env

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

## client/.env

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 🧪 Testing

1. Register two users.
2. Login in separate browsers.
3. Test Community Chat.
4. Test Direct Messages.
5. Verify typing indicators.
6. Verify online status.
7. Verify real-time message delivery.

---

# 🔒 Security

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Centralized Error Handling
- Input Validation
- CORS Configuration

---

# 🚀 Future Improvements

- Read Receipts
- Image & File Sharing
- Voice Messages
- Video Calling
- Group Management
- Push Notifications
- Redis for Horizontal Scaling
- Refresh Token Authentication

---

# 📸 Screenshots

> Add screenshots here.

- Home Page
- Login
- Community Chat
- Direct Messages
- Mobile View

---

# 👨‍💻 Author

**Prashant Malviya**

- GitHub: https://github.com/Prashant-Malviya
- LinkedIn: https://www.linkedin.com/in/prashant-malviya-57270b1b6/
- Portfolio: https://prashantmalviya-portfolio.netlify.app/

---

## ⭐ If you found this project helpful, please consider giving it a star!
