import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { subjectCatalog } from '../data/mockData';
import './Dashboard.css';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { getStudentRecords, getStudentSummary } = useAttendance();
  const navigate = useNavigate();

  const records = getStudentRecords(currentUser.id);
  const summary = getStudentSummary(currentUser.id);
  const today = new Date();
  const todayString = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const todayRecords = records.filter((record) => record.date === today.toISOString().split('T')[0]);

  return (
    <div className="page-shell dashboard-page">
      <div className="section-header dashboard-header">
        <div>
          <p className="eyebrow">Student overview</p>
          <h1>Welcome back, {currentUser.name}</h1>
        </div>
        <button type="button" className="primary-btn" onClick={() => navigate('/face-scan')}>
          Mark Attendance
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar">👩‍🎓</div>
          <div>
            <h2>{currentUser.name}</h2>
            <p>Student ID: {currentUser.id}</p>
            <p>{currentUser.department}</p>
          </div>
        </div>
        <div className="profile-meta">
          <span className="meta-badge">Today: {todayString}</span>
          {summary.percentage < 75 && <span className="meta-badge warning">Attendance below 75%</span>}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card teal">
          <div className="stat-icon">📊</div>
          <div>
            <span className="stat-label">Overall Attendance</span>
            <strong>{summary.percentage}%</strong>
          </div>
          <div className="mini-bar"><span style={{ width: `${summary.percentage}%` }} /></div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">✅</div>
          <div>
            <span className="stat-label">Present Days</span>
            <strong>{summary.present}</strong>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">❌</div>
          <div>
            <span className="stat-label">Absent Days</span>
            <strong>{summary.absent}</strong>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">🗓️</div>
          <div>
            <span className="stat-label">Total Working Days</span>
            <strong>{summary.totalWorkingDays}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Today's Status</h3>
            <span className="date-tag">{todayString}</span>
          </div>

          {todayRecords.length === 0 ? (
            <div className="empty-state">No attendance has been recorded today yet.</div>
          ) : (
            <div className="record-list">
              {todayRecords.map((record) => (
                <div className="record-item" key={record.id}>
                  <div>
                    <strong>{record.subject}</strong>
                    <small>{record.day}</small>
                  </div>
                  <div className="record-meta">
                    <span className={`status-tag ${record.status}`}>{record.status}</span>
                    <small>{record.time}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Course Progress</h3>
          </div>

          <div className="course-list">
            {subjectCatalog.map((subject) => {
              const subjectRecords = records.filter((record) => record.subject === subject);
              const present = subjectRecords.filter((record) => record.status === 'present').length;
              const total = subjectRecords.length;
              const percent = total > 0 ? Math.round((present / total) * 100) : 0;

              return (
                <div className="course-row" key={subject}>
                  <div className="course-topline">
                    <span>{subject}</span>
                    <strong>{percent}%</strong>
                  </div>
                  <div className="subject-progress"><span style={{ width: `${percent}%` }} /></div>
                  <small>{present}/{total} attended</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="cta-row">
        <button type="button" className="primary-btn" onClick={() => navigate('/face-scan')}>Face Scan</button>
        <button type="button" className="secondary-btn" onClick={() => navigate('/attendance-history')}>View History</button>
      </div>
    </div>
  );
}
