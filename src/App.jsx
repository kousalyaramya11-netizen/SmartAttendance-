import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FaceScan from './pages/FaceScan';
import AttendanceHistory from './pages/AttendanceHistory';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import StudentsPage from './pages/StudentsPage';
import ReportsPage from './pages/ReportsPage';
import TeacherView from './pages/TeacherView';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function AppContent() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/face-scan" element={<ProtectedRoute><FaceScan /></ProtectedRoute>} />
          <Route path="/attendance-history" element={<ProtectedRoute><AttendanceHistory /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute requiredRole="admin"><TeacherView /></ProtectedRoute>} />

          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-face-attendance" element={<ProtectedRoute requiredRole="admin"><FaceScan /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute requiredRole="admin"><StudentsPage /></ProtectedRoute>} />
          <Route path="/admin-attendance-history" element={<ProtectedRoute requiredRole="admin"><AttendanceHistory /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute requiredRole="admin"><ReportsPage /></ProtectedRoute>} />
          <Route path="/admin-analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalyticsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><SettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AttendanceProvider>
          <AppContent />
        </AttendanceProvider>
      </AuthProvider>
    </Router>
  );
}
