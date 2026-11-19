# MediConnect – Healthcare Appointment & Management System

> A full-stack MERN (MongoDB Atlas, Express.js, React 19, Node.js, Tailwind CSS v4) healthcare platform engineered for seamless doctor-patient connectivity, appointment scheduling with concurrency conflict prevention, digital prescription issuance, and role-based administration.

---

## 📌 Problem Statement

Traditional clinic scheduling often suffers from fragmented booking workflows, double-booked consultation slots, delayed patient notifications, and disconnected medical prescription records. **MediConnect** addresses these challenges by offering a unified, secure web platform connecting patients with verified specialists, backed by real-time database-enforced scheduling rules and protected health records.

---

## 🎯 Objectives

1. **Role-Based Isolation:** Distinct workflows and portals for Patients, Doctors, and Administrators.
2. **Concurrency-Safe Scheduling:** Database-level compound indexing to eliminate duplicate appointment bookings across simultaneous requests.
3. **Clinical Documentation:** Direct physician generation of diagnoses, symptoms, and digital prescriptions.
4. **Transparent Administration:** Live aggregation of system analytics, user statuses, and medical directory management.
5. **Modern Responsive UX:** Fast, accessible interface built with React 19 and Tailwind CSS v4.

---

## 💻 Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router 7 | Modern component architecture with client-side routing |
| **Styling** | Tailwind CSS v4 | CSS `@theme` tokens, responsive mobile-first utilities |
| **Backend** | Node.js 24, Express.js 5 | REST API with ES modules and centralized error handling |
| **Database** | MongoDB Atlas, Mongoose 9 | Cloud database with compound indexes, references, and validation |
| **Security** | JWT, bcryptjs, cookie-parser | HTTP-only cookies, Bearer token authentication, role guards |

---

## 🏗️ System Architecture

```text
[ React 19 + Tailwind CSS Frontend ] (Port 5173)
                 │  ▲
                 │  │ REST APIs / HTTP-only Cookies
                 ▼  │
[ Express.js 5 + Node.js Backend ] (Port 5000)
                 │  ▲
                 │  │ Mongoose ODM / TLS
                 ▼  │
      [ MongoDB Atlas Cluster ]
```

---

## 📂 Project Structure

```text
mediconnect/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── appointments/     # BookingModal
│   │   │   ├── common/           # ProtectedRoute
│   │   │   ├── doctors/          # DoctorCard
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   └── ui/               # Reusable Button, Card
│   │   ├── context/              # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── admin/            # AdminDashboard
│   │   │   ├── auth/             # Login, Register
│   │   │   ├── doctor/           # DoctorDashboard
│   │   │   ├── patient/          # PatientDashboard
│   │   │   └── public/           # Home, FindDoctors, DoctorDetails
│   │   ├── services/             # Centralized api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── scripts/
│   │   ├── seed.js               # Database seeding
│   │   └── testSuite.js          # Automated QA verification
│   ├── src/
│   │   ├── config/               # db.js (MongoDB Atlas connection)
│   │   ├── controllers/          # auth, doctor, appointment, record, admin
│   │   ├── middleware/           # authMiddleware, errorMiddleware
│   │   ├── models/               # User, Doctor, Appointment, Record, Notification
│   │   ├── routes/               # health, auth, doctor, appointment, record, admin
│   │   ├── utils/                # tokenUtils (JWT & Cookies)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env                      # Kept private (git-ignored)
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
├── DEMO_GUIDE.md
└── PROJECT_STATUS.md
```

---

## 🗄️ Database Models

1. **User:** `name`, `email` (unique), `passwordHash`, `role` (patient/doctor/admin), `phone`, `isActive`.
2. **Doctor:** `userId` (ref User), `specialization`, `qualifications`, `experience`, `consultationFee`, `hospital`, `location`, `availableDays`, `availableSlots`, `rating`, `isApproved`.
3. **Appointment:** `patientId`, `doctorId`, `appointmentDate`, `appointmentTime`, `reason`, `status` (pending/confirmed/completed/cancelled), `consultationFee`. Compound unique index on `(doctorId, appointmentDate, appointmentTime)` prevents double-booking.
4. **MedicalRecord:** `patientId`, `doctorId`, `appointmentId`, `diagnosis`, `symptoms`, `consultationNotes`, `prescription` (items with medicine, dosage, frequency, duration, instructions).
5. **Notification:** `userId`, `title`, `message`, `type`, `isRead`, `createdAt`.

---

## 🔌 API Overview

### Authentication (`/api/auth`)
- `POST /register` – Register patient or doctor
- `POST /login` – Secure login & HTTP-only cookie
- `POST /logout` – Clear session
- `GET  /me` – Retrieve authenticated session
- `PUT  /profile` – Update user profile

### Doctors (`/api/doctors`)
- `GET    /` – Query doctors with specialty and search filters
- `GET    /:id` – Detailed doctor profile
- `POST   /` – Onboard new doctor (Admin)
- `PUT    /:id` – Update profile & availability (Doctor/Admin)
- `DELETE /:id` – Deactivate doctor account (Admin)

### Appointments (`/api/appointments`)
- `POST  /` – Book consultation (Patient)
- `GET   /my` – Logged-in patient appointments
- `GET   /doctor` – Logged-in doctor appointments
- `GET   /` – All appointments (Admin)
- `PATCH /:id/status` – Update status (Confirm/Complete)
- `PATCH /:id/cancel` – Cancel appointment

### Medical Records (`/api/medical-records`)
- `POST /` – Issue diagnosis & digital prescription (Doctor)
- `GET  /my` – Patient medical records history
- `GET  /appointment/:id` – Record for specific consultation

### Administration (`/api/admin`)
- `GET   /stats` – Aggregated platform metrics
- `GET   /users` – User management list
- `PATCH /users/:id/status` – Toggle user active status

---

## 🚀 Installation & Running

### 1. Prerequisites
- Node.js (v18+ or v24)
- npm
- MongoDB Atlas cluster account

### 2. Backend Setup
```powershell
cd mediconnect/backend
npm install
```
Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mediconnect?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Seed demo doctors and accounts:
```powershell
npm run seed
```

Start the backend:
```powershell
npm run dev
```

### 3. Frontend Setup
```powershell
cd mediconnect/frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 👥 Demo Accounts (Academic Review)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `patient@mediconnect.com` | `Patient@123` |
| **Doctor** | `sarah.jenkins@mediconnect.com` | `Doctor@123` |
| **Admin** | `admin@mediconnect.com` | `Admin@123` |

*(Quick 1-click fill buttons are available on the `/login` screen)*

---

## 🔮 Future Enhancements
- Telemedicine video consultation via WebRTC
- Automated SMS appointment reminders
- Multi-hospital branch management
- Patient lab test report PDF uploads
