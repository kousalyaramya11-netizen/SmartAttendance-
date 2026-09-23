import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import './Analytics.css';

export default function Analytics() {
  const { currentUser } = useAuth();
  const { getStudentSummary, getSubjectAnalytics } = useAttendance();

  const summary = getStudentSummary(currentUser.id);
  const subjectAnalytics = getSubjectAnalytics(currentUser.id);

  return (
    <div className="analytics-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Performance Overview</p>
          <h1>Attendance Analytics</h1>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card highlight">
          <span className="card-label">Overall Attendance</span>
          <strong>{summary.percentage}%</strong>
          <div className="mini-progress">
            <span style={{ width: `${summary.percentage}%` }} />
          </div>
        </div>

        <div className="analytics-card">
          <span className="card-label">Present</span>
          <strong>{summary.present}</strong>
        </div>

        <div className="analytics-card">
          <span className="card-label">Absent</span>
          <strong>{summary.absent}</strong>
        </div>
      </div>

      <div className="analytics-panel">
        <div className="panel-header">
          <h2>Progress</h2>
          <span className={`status-pill ${summary.percentage >= 75 ? 'good' : 'warning'}`}>
            {summary.percentage >= 75 ? 'On Track' : 'Needs Attention'}
          </span>
        </div>

        <div className="big-progress">
          <span style={{ width: `${summary.percentage}%` }} />
        </div>
        <div className="progress-meta">
          <span>{summary.present} present</span>
          <span>{summary.absent} absent</span>
        </div>
      </div>

      <div className="analytics-panel">
        <div className="panel-header">
          <h2>Subject-wise Attendance</h2>
        </div>

        {subjectAnalytics.length === 0 ? (
          <div className="empty-state">No attendance data yet. Mark your first face scan.</div>
        ) : (
          <div className="subject-list">
            {subjectAnalytics.map((entry) => (
              <div key={entry.subject} className="subject-row">
                <div className="subject-topline">
                  <span>{entry.subject}</span>
                  <strong>{entry.percentage}%</strong>
                </div>
                <div className="subject-bar">
                  <span style={{ width: `${entry.percentage}%` }} />
                </div>
                <small>{entry.present}/{entry.total} sessions</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
