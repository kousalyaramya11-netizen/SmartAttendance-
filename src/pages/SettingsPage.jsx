import './AdminPages.css';

export default function SettingsPage() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">System controls</p>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-settings-card">
          <h2>Attendance configuration</h2>
          <div className="admin-mini-list">
            <div className="admin-mini-item"><span>Minimum attendance threshold</span><strong>75%</strong></div>
            <div className="admin-mini-item"><span>Default verification mode</span><strong>Face Recognition</strong></div>
            <div className="admin-mini-item"><span>Attendance reminder</span><strong>Enabled</strong></div>
          </div>
        </div>

        <div className="admin-settings-card">
          <h2>Faculty access</h2>
          <div className="admin-mini-list">
            <div className="admin-mini-item"><span>Admin ID</span><strong>ADMIN-001</strong></div>
            <div className="admin-mini-item"><span>Role</span><strong>Faculty</strong></div>
            <div className="admin-mini-item"><span>Session state</span><strong>Active</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
