# 🎓 AI-Based Smart Student Attendance System

A modern, fast, and automated student attendance web application powered by **React**, **Vite**, and **Browser AI Face Detection** (`face-api.js` / `TinyFaceDetector`). Designed for smart campuses and college hackathons.

---

## ⚡ Super Easy Run Guide (No Coding / CS Knowledge Needed!)

### 🤔 What is the Frontend vs. the Backend?

* **The Frontend (The Website):**
  This is the visual application you see in your browser — the **Login Page**, **Student Dashboard**, **Teacher Dashboard**, **Live Camera Face Scanner**, and **Attendance History**.
* **The Backend (The Server & Database):**
  This is the background API service connecting to a PostgreSQL database.

> 💡 **For demos and hackathons, you only need to run the Frontend!**
> The frontend already includes demo student & teacher profiles, realistic course data, and in-browser AI face recognition. You do not need to set up any database to see and use the website!

---

### 🟢 How to Run the Website (Frontend) Right Now

Open your terminal in the project folder and run **just this one command**:

```bash
npm run dev
```
*(or simply run `./run.sh` on Ubuntu / Linux)*

Once you press Enter, you will see output like this:

```text
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

👉 **Click or open `http://localhost:5173` in your web browser!**
That's it! Your website is live and ready to use.

---

### 🔵 How to Run BOTH Frontend and Backend (Full Stack)

If you want to run the full application with the backend API:

#### 1. Open Terminal 1 (Frontend Website):
```bash
npm run dev
```
*Runs the visual web app on `http://localhost:5173`.*

#### 2. Open Terminal 2 (Backend Server API):
```bash
npm run server
```
*Runs the backend API on `http://localhost:4000`.*

---

## 💻 Operating System Setup Instructions

### 🐧 Ubuntu / Debian Linux

```bash
# 1. Open terminal and enter project directory
cd ~/smart_attendance_app

# 2. Install dependencies (only needed the first time)
npm install

# 3. Launch the website
npm run dev
```

*(Or just double-click or run `./run.sh`)*

---

### 🪟 Windows (Command Prompt or PowerShell)

```powershell
# 1. Open PowerShell or Command Prompt
cd smart_attendance_app

# 2. Install dependencies (only needed the first time)
npm install

# 3. Launch the website
npm run dev
```

Then open **`http://localhost:5173`** in Chrome, Edge, or Firefox.

---

### 🍎 macOS

```bash
cd smart_attendance_app
npm install
npm run dev
```

---

## 🧪 Quick Demo Login Credentials

The login page includes quick 1-click demo buttons at the bottom. You can also sign in with these credentials:

| Role | Email | Password |
|---|---|---|
| **Student** | `kousalya@college.edu` | `student123` |
| **Teacher** | `ramesh@college.edu` | `teacher123` |
| **Admin** | `admin@college.edu` | `admin123` |

---

## 📷 Important: Camera Troubleshooting

### ❓ Issue: "Camera works when only one window is open, but fails when VS Code and Firefox are open together"

* **Why it happens**: Your computer's webcam driver allows only **one program or browser tab** to stream from the camera hardware at a time. If VS Code's internal browser preview opens the camera, it locks the webcam. When Firefox tries to open it at the same time, the operating system blocks it with a "Device busy" error (`NotReadableError`).
* **The fix**: Close the VS Code preview tab or other browser tabs using the camera before opening the app in Firefox.
* **Manual option**: If your camera is busy or unavailable, click the **"Mark Attendance Manually"** button on the Face Scan page to mark attendance without the camera.

---

## 🛠️ Handy Commands Reference

| What you want to do | Command to run |
|---|---|
| **Run the website (Frontend)** | `npm run dev` (or `npm start`) |
| **Run the backend API** | `npm run server` |
| **Run all automated unit tests** | `npm test` |
| **Build for production** | `npm run build` |
| **Build for GitHub Pages** | `npm run build:gh-pages` |

---

## 📂 Project Structure Overview

```text
smart_attendance_app/
├── public/                 # Static assets & AI face-detector neural models
├── src/
│   ├── components/         # Reusable UI elements (Navbar, ProtectedRoute)
│   ├── context/            # AuthContext & AttendanceContext
│   ├── data/               # Mock data (students, courses, attendance history)
│   ├── pages/
│   │   ├── Login.jsx            # Sign-in page with quick-demo buttons
│   │   ├── StudentDashboard.jsx # Student attendance metrics & courses
│   │   ├── AdminDashboard.jsx   # Teacher / Admin attendance overview
│   │   ├── FaceScan.jsx         # Live face detection & attendance trigger
│   │   └── AttendanceHistory.jsx# Searchable attendance table
│   ├── App.jsx             # Route definitions & page protection
│   └── index.css           # Global modern dark theme styling
├── server/                 # Optional Express + PostgreSQL backend API
├── tests/                  # Automated unit test suite
├── .github/workflows/      # Automated CI/CD & GitHub Pages deployment
├── run.sh                  # One-click start script for Linux
└── package.json            # Scripts & project dependencies
```
