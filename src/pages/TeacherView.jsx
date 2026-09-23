import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPages.css';

export default function TeacherView() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError('');

      const storedUser = localStorage.getItem('smart-attendance-user');
      const accessToken = storedUser ? JSON.parse(storedUser)?.token : null;

      const response = await fetch('http://localhost:4000/api/attendance/today', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to load teacher attendance.');
      }

      setRows(data.records || []);
      setSummary(data.summary || { totalStudents: 0, present: 0, absent: 0 });
    } catch (loadError) {
      setError(loadError.message || 'Unable to load teacher attendance.');
      setRows([]);
      setSummary({ totalStudents: 0, present: 0, absent: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Teacher View</p>
          <h1>Today's Attendance</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="admin-primary-btn" onClick={() => navigate('/face-scan')}>
            Start Face Attendance
          </button>
          <button type="button" className="admin-secondary-btn" onClick={loadAttendance}>
            Refresh Attendance
          </button>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{summary.totalStudents}</span>
            <span className="admin-stat-label">Total Students</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{summary.present}</span>
            <span className="admin-stat-label">Present</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">❌</div>
          <div className="admin-stat-meta">
            <span className="admin-stat-value">{summary.absent}</span>
            <span className="admin-stat-label">Absent</span>
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <h2>Attendance Record</h2>

        {loading ? (
          <p className="admin-subtitle">Loading attendance...</p>
        ) : rows.length === 0 ? (
          <p className="admin-subtitle">No attendance records for today.</p>
        ) : (
          <table className="admin-reports-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id || `${row.studentid}-${row.date}-${row.time}`}>
                  <td>{row.studentid || row.studentId}</td>
                  <td>{row.student_name || row.studentName || 'Unknown Student'}</td>
                  <td>{row.date}</td>
                  <td>{row.time || row.recordedat || '—'}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
