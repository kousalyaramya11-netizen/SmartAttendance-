import { useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { allStudents } from '../data/mockData';
import './AdminPages.css';

export default function AdminAnalyticsPage() {
  const { records } = useAttendance();

  const analytics = useMemo(() => {
    const studentAverages = allStudents.map((student) => {
      const studentRecords = records.filter((record) => record.studentId === student.id);
      const present = studentRecords.filter((record) => record.status === 'present' || record.status === 'late').length;
      const total = studentRecords.length || 1;
      const percentage = Math.round((present / total) * 100);
      return { student, percentage };
    });

    const belowThreshold = studentAverages.filter((entry) => entry.percentage < 75);
    const avgClassAttendance = studentAverages.length
      ? Math.round(studentAverages.reduce((sum, entry) => sum + entry.percentage, 0) / studentAverages.length)
      : 0;
    const recent = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
    const attendanceTrend = avgClassAttendance >= 75 ? 'Positive momentum' : 'Needs intervention';

    return { belowThreshold, avgClassAttendance, recent, attendanceTrend };
  }, [records]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Adaptive monitoring</p>
          <h1>AI Attendance Insights</h1>
        </div>
      </div>

      <div className="admin-insights-grid">
        <div className="admin-insight-card">
          <span className="admin-stat-label">Students below 75%</span>
          <strong className="admin-stat-value" style={{ fontSize: '1.8rem' }}>{analytics.belowThreshold.length}</strong>
        </div>
        <div className="admin-insight-card">
          <span className="admin-stat-label">Average class attendance</span>
          <strong className="admin-stat-value" style={{ fontSize: '1.8rem' }}>{analytics.avgClassAttendance}%</strong>
        </div>
        <div className="admin-insight-card">
          <span className="admin-stat-label">Most recent activity</span>
          <strong className="admin-stat-value" style={{ fontSize: '1.1rem' }}>{analytics.recent[0]?.subject || 'No records'}</strong>
        </div>
        <div className="admin-insight-card">
          <span className="admin-stat-label">Attendance trend</span>
          <strong className="admin-stat-value" style={{ fontSize: '1.1rem' }}>{analytics.attendanceTrend}</strong>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-panel">
          <h2>Low attendance watchlist</h2>
          <div className="admin-mini-list">
            {analytics.belowThreshold.length === 0 ? (
              <div className="admin-alert-item">
                <span>Everyone is above the 75% threshold.</span>
              </div>
            ) : (
              analytics.belowThreshold.map((entry) => (
                <div key={entry.student.id} className="admin-mini-item">
                  <span>{entry.student.name}</span>
                  <strong>{entry.percentage}%</strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-panel">
          <h2>Recent attendance activity</h2>
          <div className="admin-mini-list">
            {analytics.recent.map((entry) => (
              <div key={entry.id} className="admin-mini-item">
                <span>{entry.studentId}</span>
                <strong>{entry.status}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-ai-note">AI-powered analytics derived from current attendance data and student performance trends.</div>
    </div>
  );
}
