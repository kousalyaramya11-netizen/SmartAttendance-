import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { allStudents } from '../data/mockData';
import './AttendanceHistory.css';

export default function AttendanceHistory() {
  const { currentUser } = useAuth();
  const { records } = useAttendance();
  const [statusFilter, setStatusFilter] = useState('all');
  const isAdmin = currentUser.role === 'admin';

  const studentMap = Object.fromEntries(allStudents.map((student) => [student.id, student]));

  const filteredRecords = useMemo(() => {
    const sourceRecords = isAdmin ? records : records.filter((record) => record.studentId === currentUser.id);
    const sorted = [...sourceRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (statusFilter === 'all') return sorted;
    return sorted.filter((record) => record.status === statusFilter);
  }, [currentUser.id, isAdmin, records, statusFilter]);

  const summary = {
    present: filteredRecords.filter((record) => record.status === 'present' || record.status === 'late').length,
    absent: filteredRecords.filter((record) => record.status === 'absent').length,
    percentage: filteredRecords.length
      ? Math.round((filteredRecords.filter((record) => record.status === 'present' || record.status === 'late').length / filteredRecords.length) * 100)
      : 0,
  };

  return (
    <div className="page-shell history-page">
      <div className="section-header history-header">
        <div>
          <p className="eyebrow">Record log</p>
          <h1>{isAdmin ? 'Faculty Attendance History' : 'Attendance History'}</h1>
        </div>
      </div>

      <div className="history-summary">
        <div className="summary-card">
          <span>Total</span>
          <strong>{filteredRecords.length}</strong>
        </div>
        <div className="summary-card present">
          <span>Present</span>
          <strong>{summary.present}</strong>
        </div>
        <div className="summary-card absent">
          <span>Absent</span>
          <strong>{summary.absent}</strong>
        </div>
        <div className="summary-card percent">
          <span>Rate</span>
          <strong>{summary.percentage}%</strong>
        </div>
      </div>

      <div className="filter-row">
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table className="attendance-table">
          <thead>
            <tr>
              {isAdmin && <th>Student ID</th>}
              {isAdmin && <th>Student Name</th>}
              {isAdmin && <th>Department</th>}
              {!isAdmin && <th>Date</th>}
              {!isAdmin && <th>Day</th>}
              {!isAdmin && <th>Subject</th>}
              {isAdmin && <th>Subject</th>}
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 6} className="empty-row">No attendance records available for the selected filter.</td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const student = studentMap[record.studentId] || { name: 'Unknown', department: 'N/A' };
                return (
                  <tr key={record.id}>
                    {isAdmin && <td>{record.studentId}</td>}
                    {isAdmin && <td>{student.name}</td>}
                    {isAdmin && <td>{student.department}</td>}
                    {!isAdmin && <td>{record.date}</td>}
                    {!isAdmin && <td>{record.day}</td>}
                    {!isAdmin && <td>{record.subject}</td>}
                    {isAdmin && <td>{record.subject}</td>}
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>{record.status}</span>
                    </td>
                    <td>{record.method}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
