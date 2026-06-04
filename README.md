# 🎮 Player Finder Platform — MERN Stack

A web application to help gamers find teammates for multiplayer games.

---

## 📁 Project Structure

```
player-finder/
├── backend/                  # Node.js + Express (MVC)
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── requestController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Request.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── requestRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── seed.js                # Seed admin + sample players
│   └── server.js
│
└── frontend/                  # React + Vite + Tailwind CSS
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Axios with JWT interceptor
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── PlayerCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── FindPlayersPage.jsx
    │   │   ├── RequestsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       └── AdminUsers.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev        # Development with nodemon
# or
npm start          # Production
```

### 2. Seed Database (Optional)

```bash
cd backend
node seed.js
```
Creates:
- Admin: `admin@pf.com` / `admin123`
- 5 sample players (password: `test123`)

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/search | Search players (game, skillLevel) |
| PUT | /api/users/profile | Update profile |
| GET | /api/users/:id | Get player by ID |

### Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/requests | Send play request |
| GET | /api/requests/incoming | Incoming requests |
| GET | /api/requests/sent | Sent requests |
| GET | /api/requests/matches | Accepted matches |
| PUT | /api/requests/:id | Accept/Reject request |

### Admin (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Stats overview |
| GET | /api/admin/users | All users |
| PUT | /api/admin/users/:id/block | Block/Unblock user |
| DELETE | /api/admin/users/:id | Delete user |
| GET | /api/admin/games | Available games list |

---

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken + bcryptjs)

---

## 📋 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/player-finder
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```
