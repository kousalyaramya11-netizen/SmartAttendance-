import { useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { allStudents } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPages.css';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { records } = useAttendance();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const studentStats = useMemo(() => {
    return allStudents.map((student) => {
      const studentRecords = records.filter((record) => record.studentId === student.id);
      const present = studentRecords.filter((record) => record.status === 'present' || record.status === 'late').length;
      const absent = studentRecords.filter((record) => record.status === 'absent').length;
      const total = studentRecords.length || 1;
      const percentage = Math.round((present / total) * 100);
      return { ...student, present, absent, total, percentage };
    });
  }, [records]);

  const todayRecords = records.filter((record) => record.date === today);
  const presentToday = todayRecords.filter((record) => record.status === 'present' || record.status === 'late').length;
  const absentToday = todayRecords.filter((record) => record.status === 'absent').length;
  const lateToday = todayRecords.filter((record) => record.status === 'late').length;
  const averageClassAttendance = studentStats.length
    ? Math.round(studentStats.reduce((sum, student) => sum + student.percentage, 0) / studentStats.length)
    : 0;
  const highestAttendance = studentStats.length ? Math.max(...studentStats.map((student) => student.percentage)) : 0;
  const lowestAttendance = studentStats.length ? Math.min(...studentStats.map((student) => student.percentage)) : 0;
  const lowAttendanceStudents = studentStats.filter((student) => student.percentage < 75);

  const trendData = useMemo(() => {
    const byDate = new Map();

    [...records]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((record) => {
        if (!byDate.has(record.date)) {
          byDate.set(record.date, { present: 0, absent: 0, total: 0 });
        }

        const bucket = byDate.get(record.date);
        bucket.total += 1;
        if (record.status === 'present' || record.status === 'late') {
          bucket.present += 1;
        } else if (record.status === 'absent') {
          bucket.absent += 1;
        }
      });

    return Array.from(byDate.entries())
      .slice(-7)
      .map(([date, data]) => ({
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: data.present,
        absent: data.absent,
        total: data.total,
        percent: data.total ? Math.round((data.present / data.total) * 100) : 0,
      }));
  }, [records]);

  const recentAttendance = [...records]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
    .map((entry) => {
      const student = allStudents.find((item) => item.id === entry.studentId);
      return {
        ...entry,
        studentName: student ? student.name : 'Unknown',
        department: student ? student.department : 'N/A',
      };
    });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Faculty overview</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome, {currentUser.name} • {currentUser.department}</p>
        </div>
        <button type="button" className="admin-primary-btn" onClick={() => navigate('/admin-face-attendance')}>
          Face Attendance
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{studentStats.length}</span>
            <span className="admin-stat-label">Total Students</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{presentToday}</span>
            <span className="admin-stat-label">Present Today</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">❌</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{absentToday}</span>
            <span className="admin-stat-label">Absent Today</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📊</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{averageClassAttendance}%</span>
            <span className="admin-stat-label">Average Class Attendance</span>
            <div className="admin-bar-wrap">
              <div className="admin-bar-fill" style={{ width: `${averageClassAttendance}%` }} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">⚠️</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{lowAttendanceStudents.length}</span>
            <span className="admin-stat-label">Low Attendance Students</span>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-panel">
          <h2>Attendance Overview</h2>
          <div className="admin-chart">
            <div className="admin-chart-row">
              <span className="admin-chart-label">Present</span>
              <div className="admin-chart-bar-shell">
                <div
                  className="admin-chart-bar present"
                  style={{
                    width: `${Math.max(
                      10,
                      (presentToday / Math.max(1, todayRecords.length || presentToday + absentToday + lateToday)) * 100,
                    )}%`,
                  }}
                />
              </div>
              <span className="admin-chart-value">{presentToday}</span>
            </div>
            <div className="admin-chart-row">
              <span className="admin-chart-label">Absent</span>
              <div className="admin-chart-bar-shell">
                <div
                  className="admin-chart-bar absent"
                  style={{
                    width: `${Math.max(
                      10,
                      (absentToday / Math.max(1, todayRecords.length || presentToday + absentToday + lateToday)) * 100,
                    )}%`,
                  }}
                />
              </div>
              <span className="admin-chart-value">{absentToday}</span>
            </div>
            <div className="admin-chart-row">
              <span className="admin-chart-label">Late</span>
              <div className="admin-chart-bar-shell">
                <div
                  className="admin-chart-bar late"
                  style={{
                    width: `${Math.max(
                      10,
                      (lateToday / Math.max(1, todayRecords.length || presentToday + absentToday + lateToday)) * 100,
                    )}%`,
                  }}
                />
              </div>
              <span className="admin-chart-value">{lateToday}</span>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <h2>AI Attendance Insights</h2>
          <div className="admin-mini-list">
            <div className="admin-mini-item">
              <span>Average class attendance</span>
              <strong>{averageClassAttendance}%</strong>
            </div>
            <div className="admin-mini-item">
              <span>Students below 75%</span>
              <strong>{lowAttendanceStudents.length}</strong>
            </div>
            <div className="admin-mini-item">
              <span>Highest attendance</span>
              <strong>{highestAttendance}%</strong>
            </div>
            <div className="admin-mini-item">
              <span>Lowest attendance</span>
              <strong>{lowestAttendance}%</strong>
            </div>
            <div className="admin-mini-item">
              <span>Present students today</span>
              <strong>{presentToday}</strong>
            </div>
            <div className="admin-mini-item">
              <span>Absent students today</span>
              <strong>{absentToday}</strong>
            </div>
            <div className="admin-mini-item">
              <span>Recent attendance activity</span>
              <strong>{recentAttendance[0]?.subject || 'N/A'}</strong>
            </div>
          </div>
          <div className="admin-ai-note">AI-powered attendance insights</div>
        </div>
      </div>

      <div className="admin-panel trend-panel">
        <h2>Attendance Trend</h2>
        <div className="trend-chart">
          {trendData.map((point) => (
            <div key={point.label} className="trend-chart-column">
              <div className="trend-chart-bar-wrap">
                <div className="trend-chart-bar" style={{ height: `${Math.max(point.percent, 10)}%` }} />
              </div>
              <span>{point.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-alerts">
        <div className="admin-alert-box">
          <h3>LOW ATTENDANCE ALERT</h3>
          <div className="admin-alert-list">
            {lowAttendanceStudents.length === 0 ? (
              <div className="admin-alert-item">
                <span>No students are below the 75% threshold.</span>
                <span className="admin-alert-status">Healthy</span>
              </div>
            ) : (
              lowAttendanceStudents.slice(0, 5).map((student) => (
                <div key={student.id} className="admin-alert-item low-attendance-item">
                  <div className="admin-alert-meta">
                    <strong>{student.name}</strong>
                    <span>{student.id}</span>
                  </div>
                  <div className="admin-alert-score">
                    <span>{student.percentage}%</span>
                    <span className="warning-badge">Low Attendance</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <h2>Recent Attendance</h2>
        <table className="admin-recent-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {recentAttendance.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.studentId}</td>
                <td>{entry.studentName}</td>
                <td>{entry.department}</td>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
                <td>
                  <span className={`admin-status-badge ${entry.status}`}>{entry.status}</span>
                </td>
                <td>{entry.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
