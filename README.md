# 🎓 AI-Based Smart Student Attendance System

A modern, fast, and automated student attendance web application powered by **React**, **Vite**, and **AI Face Detection** (`face-api.js` / `TinyFaceDetector`). Designed for smart campuses and college hackathons.

---

## 🌟 Key Features

- **Automated Face Scan**: Real-time facial detection and verification directly inside the browser using client-side AI models (`face-api.js`).
- **Student Dashboard**: Live overall attendance metrics, attendance percentages, course breakdown, and attendance trends.
- **Teacher / Admin Dashboard**: Real-time attendance stats, classroom tracking, and student attendance overviews.
- **Attendance History**: Searchable, filterable attendance logs with timestamps and verification methods.
- **Role-Based Access Control**: Clean role switches for Student, Teacher, and Administrator accounts.
- **Responsive Dark UI**: Clean, glassmorphism-inspired dark design tailored for desktop, laptop, and mobile screens.

---

## 🚀 Quick Setup & Run Guide

### 1. Prerequisites

Make sure you have Node.js installed on your machine:
- **Node.js** (v18.0.0 or higher, recommended v20 LTS)
- **npm** (comes with Node.js) or **yarn** / **pnpm**
- *(Optional)* **PostgreSQL** if running the optional backend server

---

### 💻 Ubuntu / Debian Linux Setup

```bash
# 1. Update and install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone the repository
git clone https://github.com/kousalyaramya11-netizen/SmartAttendance-.git
cd SmartAttendance-

# 3. Install dependencies
npm install

# 4. Start the frontend application
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

### 🪟 Windows Setup (PowerShell / Command Prompt)

```powershell
# 1. Make sure Node.js is installed from https://nodejs.org/
node -v
npm -v

# 2. Clone the repository
git clone https://github.com/kousalyaramya11-netizen/SmartAttendance-.git
cd SmartAttendance-

# 3. Install project dependencies
npm install

# 4. Run the development server
npm run dev
```

Visit **`http://localhost:5173`** in Chrome, Edge, or Firefox.

---

### 🍎 macOS Setup

```bash
# 1. Using Homebrew (optional)
brew install node

# 2. Clone repository & install dependencies
git clone https://github.com/kousalyaramya11-netizen/SmartAttendance-.git
cd SmartAttendance-
npm install

# 3. Run the development server
npm run dev
```

---

## ⚙️ Running Optional Backend Server (PostgreSQL)

The frontend includes mock data and standalone in-memory state out of the box. If you wish to run the full REST API with PostgreSQL:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update your `DATABASE_URL` in `.env` with your PostgreSQL credentials.
3. Start the backend:
   ```bash
   npm run server
   ```

---

## 📷 Important: Camera Access & Multi-Instance Behavior

### ❓ Issue: "Camera works when only one window is open, but fails when VS Code / IDE Preview and Firefox are open together"

#### Why this happens:
1. **Operating System Hardware Locks (V4L2 on Linux / DirectShow on Windows)**:
   - On Linux and many webcams, video capture devices (such as `/dev/video0`) operate under exclusive hardware access.
   - When an application (like VS Code's internal browser, another browser tab, or OBS) opens the webcam, the OS driver locks the camera exclusively for that process.
   - When a second application (e.g. Firefox) tries to call `navigator.mediaDevices.getUserMedia()`, the operating system refuses access with an `EBUSY` error ("Device or resource busy"). Firefox surfaces this as `NotReadableError: Could not start video source` or `AbortError`.

#### How to resolve:
- **Close other webcam consumers**: Ensure only **one** browser tab or application is accessing the camera at a time.
- **Close VS Code Simple Browser / Live Preview tabs** before opening the app in Firefox or Chrome.
- **Grant Browser Permissions**: Make sure Firefox or your browser has permission to access the webcam under your system settings (`Preferences > Privacy & Security > Permissions > Camera`).
- **Use Manual Fallback**: If the camera is busy or unavailable, you can use the built-in **"Mark Attendance Manually"** button on the Face Scan page.

---

## 🧪 Demo Login Credentials

You can use the one-click quick login buttons on the Login page or sign in with:

| Role | Email | Password |
|---|---|---|
| **Student** | `kousalya@college.edu` | `student123` |
| **Teacher** | `ramesh@college.edu` | `teacher123` |
| **Admin** | `admin@college.edu` | `admin123` |

---

## 📂 Project Structure

```text
smart_attendance_app/
├── public/                 # Static assets & face-api neural net models
│   ├── models/             # TinyFaceDetector weights & manifests
│   └── favicon.svg         # Graduation cap favicon
├── src/
│   ├── assets/             # Icons and graphics
│   ├── components/         # Reusable UI components (Navbar, ProtectedRoute)
│   ├── context/            # AuthContext & AttendanceContext (in-memory state)
│   ├── data/               # Realistic mock data (students, courses, logs)
│   ├── pages/
│   │   ├── Login.jsx            # Sign-in page with quick-demo buttons
│   │   ├── StudentDashboard.jsx # Student metrics & courses
│   │   ├── AdminDashboard.jsx   # Admin/Teacher class overview
│   │   ├── FaceScan.jsx         # Live face detection & attendance trigger
│   │   └── AttendanceHistory.jsx# Searchable attendance table
│   ├── App.jsx             # React Router setup & protected routes
│   └── index.css           # Global dark theme styling
├── server/                 # Optional Express + PostgreSQL backend
├── .env.example            # Sample configuration for backend
├── .gitignore              # Ignored files (node_modules, .env, dist)
├── package.json            # Project dependencies and npm scripts
└── vite.config.js          # Vite build configuration
```

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the Vite development server on `http://localhost:5173`.
- `npm run build`: Compiles optimized production assets into `dist/`.
- `npm run preview`: Locally preview the production build.
- `npm run server`: Starts the optional Express backend server.

---

## 👥 Authors & Acknowledgments

Created for the **AI-Based Smart Student Attendance System** hackathon project.
