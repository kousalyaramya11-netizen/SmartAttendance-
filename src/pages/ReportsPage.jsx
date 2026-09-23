import { useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { allStudents } from '../data/mockData';
import './AdminPages.css';

const buildSummary = (records, labelKey, formatLabel) => {
  const groups = new Map();

  records.forEach((record) => {
    const key = formatLabel(record);
    if (!groups.has(key)) {
      groups.set(key, { label: key, present: 0, absent: 0, total: 0 });
    }

    const group = groups.get(key);
    group.total += 1;
    if (record.status === 'present' || record.status === 'late') {
      group.present += 1;
    } else if (record.status === 'absent') {
      group.absent += 1;
    }
  });

  return Array.from(groups.values()).map((entry) => ({
    label: entry.label,
    totalStudents: allStudents.length,
    presentCount: entry.present,
    absentCount: entry.absent,
    presentPercent: entry.total ? Math.round((entry.present / entry.total) * 100) : 0,
    absentPercent: entry.total ? Math.round((entry.absent / entry.total) * 100) : 0,
  }));
};

export default function ReportsPage() {
  const { records } = useAttendance();

  const summary = useMemo(() => {
    const daily = buildSummary(records, 'date', (record) => record.date);
    const weekly = buildSummary(records, 'week', (record) => {
      const date = new Date(record.date);
      const start = new Date(date);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(start.setDate(diff));
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    });
    const monthly = buildSummary(records, 'month', (record) => {
      const date = new Date(record.date);
      return new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    const latestDaily = daily[daily.length - 1] || { presentPercent: 0, absentPercent: 0, totalStudents: allStudents.length, presentCount: 0, absentCount: 0 };
    const latestWeekly = weekly[weekly.length - 1] || { presentPercent: 0, absentPercent: 0, totalStudents: allStudents.length, presentCount: 0, absentCount: 0 };
    const latestMonthly = monthly[monthly.length - 1] || { presentPercent: 0, absentPercent: 0, totalStudents: allStudents.length, presentCount: 0, absentCount: 0 };

    return {
      daily,
      weekly,
      monthly,
      latestDaily,
      latestWeekly,
      latestMonthly,
    };
  }, [records]);

  const exportCsv = () => {
    const rows = [
      ['Student ID', 'Student Name', 'Department', 'Date', 'Time', 'Status', 'Attendance Method'],
      ...records.map((record) => {
        const student = allStudents.find((item) => item.id === record.studentId);
        return [
          record.studentId,
          student ? student.name : 'Unknown',
          student ? student.department : 'N/A',
          record.date,
          record.time,
          record.status,
          record.method,
        ];
      }),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendance-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Reporting</p>
          <h1>Reports</h1>
        </div>
        <button type="button" className="export-csv-btn" onClick={exportCsv}>Export Attendance CSV</button>
      </div>

      <div className="admin-report-grid">
        <div className="admin-report-card">
          <span>Daily Attendance</span>
          <strong>{summary.latestDaily.presentPercent}%</strong>
          <small>Present {summary.latestDaily.presentCount} • Absent {summary.latestDaily.absentCount}</small>
        </div>
        <div className="admin-report-card">
          <span>Weekly Attendance</span>
          <strong>{summary.latestWeekly.presentPercent}%</strong>
          <small>Present {summary.latestWeekly.presentCount} • Absent {summary.latestWeekly.absentCount}</small>
        </div>
        <div className="admin-report-card">
          <span>Monthly Attendance</span>
          <strong>{summary.latestMonthly.presentPercent}%</strong>
          <small>Present {summary.latestMonthly.presentCount} • Absent {summary.latestMonthly.absentCount}</small>
        </div>
      </div>

      <div className="admin-table-card">
        <h2>Attendance Summary</h2>
        <table className="admin-reports-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Present %</th>
              <th>Absent %</th>
              <th>Total Students</th>
              <th>Present Count</th>
              <th>Absent Count</th>
            </tr>
          </thead>
          <tbody>
            {[{ label: 'Daily Attendance', data: summary.latestDaily }, { label: 'Weekly Attendance', data: summary.latestWeekly }, { label: 'Monthly Attendance', data: summary.latestMonthly }].map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.data.presentPercent}%</td>
                <td>{row.data.absentPercent}%</td>
                <td>{row.data.totalStudents}</td>
                <td>{row.data.presentCount}</td>
                <td>{row.data.absentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
