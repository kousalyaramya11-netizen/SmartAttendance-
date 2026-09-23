import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!studentId.trim() || !password.trim()) {
      setError('Please enter both Student ID and password.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await login(studentId, password);
    setLoading(false);

    if (result.success) {
      navigate(result.redirectPath || '/dashboard');
      return;
    }

    setError(result.message);
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="bubble bubble-one" />
        <div className="bubble bubble-two" />
        <div className="bubble bubble-three" />
      </div>

      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="login-logo">🎓</div>
          <div>
            <h1>Smart Attendance</h1>
          </div>
        </div>

        <p className="login-subtitle">Smart attendance management for students and faculty</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-box">{error}</div>}

          <label className="field-group">
            <span>Student ID</span>
            <div className="field-shell">
              <span className="field-icon">🆔</span>
              <input
                type="text"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="Enter Student ID"
              />
            </div>
          </label>

          <label className="field-group">
            <span>Password</span>
            <div className="field-shell">
              <span className="field-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
              />
            </div>
          </label>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
}
