import { createContext, useContext, useEffect, useState } from 'react';
import { attendanceSeed } from '../data/mockData';

const AttendanceContext = createContext(null);
const STORAGE_KEY = 'smart-attendance-records';

function getSeedData() {
  return attendanceSeed.map((entry) => ({ ...entry }));
}

function loadStoredRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return getSeedData();
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getSeedData();
  } catch (error) {
    console.error('Unable to load attendance records from localStorage:', error);
    return getSeedData();
  }
}

function isPresentStatus(status) {
  return status === 'present' || status === 'late';
}

export function AttendanceProvider({ children }) {
  const [records, setRecords] = useState(() => loadStoredRecords());
  const [lastMarked, setLastMarked] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const markAttendance = (studentId, subject, options = {}) => {
    const now = new Date();
    const date = options.date || now.toISOString().split('T')[0];
    const existingRecord = records.find(
      (record) => record.studentId === studentId && record.subject === subject && record.date === date,
    );

    if (existingRecord) {
      setLastMarked(existingRecord);
      return existingRecord;
    }

    const record = {
      id: Date.now(),
      studentId,
      subject,
      date,
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      time: options.time || now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: options.status || 'present',
      method: options.method || 'Face Recognition',
    };

    setRecords((prev) => [record, ...prev]);
    setLastMarked(record);
    return record;
  };

  const getStudentRecords = (studentId) =>
    records.filter((record) => record.studentId === studentId);

  const getStudentPercentage = (studentId) => {
    const studentRecords = getStudentRecords(studentId);
    const totalWorkingDays = studentRecords.length;
    if (!totalWorkingDays) return 0;
    const present = studentRecords.filter((record) => isPresentStatus(record.status)).length;
    return Math.round((present / totalWorkingDays) * 100);
  };

  const getStudentSummary = (studentId) => {
    const studentRecords = getStudentRecords(studentId);
    const present = studentRecords.filter((record) => isPresentStatus(record.status)).length;
    const absent = studentRecords.filter((record) => record.status === 'absent').length;
    const late = studentRecords.filter((record) => record.status === 'late').length;
    const totalWorkingDays = studentRecords.length;
    const percentage = totalWorkingDays > 0 ? Math.round((present / totalWorkingDays) * 100) : 0;

    return {
      present,
      absent,
      late,
      totalWorkingDays,
      percentage,
    };
  };

  const getSubjectAnalytics = (studentId) => {
    const studentRecords = getStudentRecords(studentId);
    const grouped = studentRecords.reduce((map, record) => {
      const key = record.subject;
      if (!map[key]) {
        map[key] = { subject: key, present: 0, total: 0 };
      }

      map[key].total += 1;
      if (isPresentStatus(record.status)) {
        map[key].present += 1;
      }
      return map;
    }, {});

    return Object.values(grouped)
      .map((item) => ({
        subject: item.subject,
        present: item.present,
        total: item.total,
        percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        lastMarked,
        markAttendance,
        getStudentRecords,
        getStudentPercentage,
        getStudentSummary,
        getSubjectAnalytics,
        isPresentStatus,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export const useAttendance = () => useContext(AttendanceContext);
