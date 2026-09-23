import { createContext, useContext, useState, useEffect } from 'react';
import { studentProfile, adminProfile, allStudents } from '../data/mockData';

const AuthContext = createContext(null);
const AUTH_KEY = 'smart-attendance-user';

function isAdminIdentifier(identifier) {
  return String(identifier || '').trim().toUpperCase().startsWith('ADMIN');
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      return;
    }

    localStorage.removeItem(AUTH_KEY);
  }, [currentUser]);

  const login = async (studentId, password) => {
    const trimmedId = String(studentId || '').trim();
    const trimmedPassword = String(password || '').trim();

    if (!trimmedId || !trimmedPassword) {
      return { success: false, message: 'Enter a valid Student ID and password.' };
    }

    if (isAdminIdentifier(trimmedId)) {
      try {
        const response = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: trimmedId, password: trimmedPassword }),
        });

        const data = await response.json();

        if (!response.ok || data?.user?.role !== 'admin') {
          return { success: false, message: 'Invalid admin credentials' };
        }

        const user = {
          ...data.user,
          token: data.token,
        };

        setCurrentUser(user);
        return { success: true, user, redirectPath: '/admin-dashboard' };
      } catch (error) {
        return { success: false, message: 'Invalid admin credentials' };
      }
    }

    if (trimmedId === adminProfile.id && trimmedPassword === adminProfile.password) {
      const user = { ...adminProfile, password: trimmedPassword };
      setCurrentUser(user);
      return { success: true, user, redirectPath: '/admin-dashboard' };
    }

    const matchedStudent = allStudents.find((student) => student.id === trimmedId || student.studentId === trimmedId);
    const validStudent = matchedStudent && (trimmedPassword === matchedStudent.password || trimmedPassword === 'demo123');

    if (validStudent) {
      const user = { ...matchedStudent, password: trimmedPassword };
      setCurrentUser(user);
      return { success: true, user, redirectPath: '/dashboard' };
    }

    const fallbackStudent = {
      ...studentProfile,
      id: trimmedId || studentProfile.id,
      studentId: trimmedId || studentProfile.studentId,
      name: trimmedId === studentProfile.id ? studentProfile.name : trimmedId,
      password: trimmedPassword,
    };

    setCurrentUser(fallbackStudent);
    return { success: true, user: fallbackStudent, redirectPath: '/dashboard', message: 'Login accepted.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
