# Prime Trade — Full-Stack Assessment

A production-style full-stack application built with **Node.js / Express / MongoDB** (backend) and **React / Vite / TailwindCSS** (frontend).

---

## Features

### Backend
| Feature | Details |
|---|---|
| Auth | JWT-based register & login |
| Password security | bcrypt (salt rounds: 12) |
| RBAC | `user` and `admin` roles |
| Validation | express-validator on all inputs |
| Error handling | Centralized middleware |
| API versioning | `/api/v1/` prefix |
| Swagger docs | `/api/docs` |
| DB | MongoDB via Mongoose |

### Frontend
| Feature | Details |
|---|---|
| Register / Login | Form pages with error feedback |
| Protected routes | JWT guard via React Router |
| Dashboard | Create, view, update tasks |
| Role-aware UI | Delete button only for `admin` |
| Styling | TailwindCSS |
| HTTP | Axios with auto-auth interceptor |

---

## Project Structure

```
prime_trade_assessment/
├── backend/
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── swagger.js       # Swagger/OpenAPI spec
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   ├── authorize.js     # Role-based authorization
│   │   ├── errorHandler.js  # Centralized error handling
│   │   └── validate.js      # express-validator bridge
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js  # Axios + interceptors
    │   │   ├── authApi.js
    │   │   └── taskApi.js
    │   ├── components/
    │   │   ├── Alert.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── TaskCard.jsx
    │   ├── pages/
    │   │   ├── RegisterPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── index.html
```

---

## Getting Started

### Backend

```bash
cd backend
npm install
# Edit .env if needed (MONGODB_URI, JWT_SECRET, PORT)
npm run dev         # nodemon — auto-reload
# or
npm start           # plain node
```

Server: https://prime-trade-assessment-su11.onrender.com  
Swagger UI: https://prime-trade-assessment-su11.onrender.com/api/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

> Vite proxies `/api` → `https://prime-trade-assessment-su11.onrender.com` automatically during development.

---

## API Endpoints

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | 🔒 Any | Get current user |

### Tasks (`/api/v1/tasks`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | 🔒 Any | Create task |
| GET | `/` | 🔒 Any | List tasks (own / all for admin) |
| GET | `/:id` | 🔒 Any | Get single task |
| PUT | `/:id` | 🔒 Owner / Admin | Update task |
| DELETE | `/:id` | 🔒 **Admin only** | Delete task |

---

## Creating an Admin Account

Register normally, then update the role directly in MongoDB Atlas:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```
