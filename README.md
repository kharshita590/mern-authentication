# 🎓 Student Authentication System — MERN Stack

A full-stack student registration and login system built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
mern-student-auth/
├── backend/          ← Node.js + Express + MongoDB (deploy on Render)
│   ├── models/Student.js
│   ├── routes/auth.js
│   ├── middleware/auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/         ← React app (deploy on Vercel)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Register.js
    │   │   ├── Login.js
    │   │   └── Dashboard.js
    │   ├── App.js
    │   ├── api.js
    │   └── App.css
    ├── package.json
    └── .env.example
```

---

## 🔧 Local Development

### Step 1 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env    # Fill in your MONGO_URI and JWT_SECRET
npm run dev             # Runs on http://localhost:5000
```

### Step 2 — Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Set: REACT_APP_API_URL=http://localhost:5000/api
npm start               # Runs on http://localhost:3000
```

---

## 🚀 Deployment

### Backend → Render
1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo
4. Set these **Environment Variables** in Render dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string
   - `JWT_EXPIRES_IN` — `7d`
   - `FRONTEND_URL` — your Vercel frontend URL (for CORS)
5. Build command: `npm install`
6. Start command: `node server.js`

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add **Environment Variable**:
   - `REACT_APP_API_URL` — your Render backend URL + `/api`
   - e.g., `https://student-auth-backend.onrender.com/api`
4. Deploy!

---

## 📡 API Endpoints

| Method | Endpoint              | Auth Required | Description              |
|--------|-----------------------|:---:|--------------------------|
| POST   | `/api/register`       | ❌  | Register new student     |
| POST   | `/api/login`          | ❌  | Login & get JWT token    |
| GET    | `/api/me`             | ✅  | Get logged-in student    |
| PUT    | `/api/update-password`| ✅  | Update password          |
| PUT    | `/api/update-course`  | ✅  | Change course enrollment |

---

## 🛡️ Technologies Used

| Layer      | Technology                        |
|------------|-----------------------------------|
| Database   | MongoDB Atlas + Mongoose          |
| Backend    | Node.js, Express.js               |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Frontend   | React 18, React Router v6         |
| HTTP Client| Axios                             |
| Styling    | Custom CSS + Bootstrap 5          |
| Deployment | Render (backend) + Vercel (frontend) |
# mern-authentication
