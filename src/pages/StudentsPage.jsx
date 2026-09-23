import { useMemo, useState } from 'react';
import { allStudents, MAX_REGISTERED_STUDENTS, registeredStudents, subjectCatalog } from '../data/mockData';
import { useAttendance } from '../context/AttendanceContext';
import './AdminPages.css';

export default function StudentsPage() {
  const { records } = useAttendance();
  const [query, setQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentList, setStudentList] = useState(registeredStudents);
  const [form, setForm] = useState({ studentId: '', name: '', department: 'Computer Science', year: 'I Year' });
  const [message, setMessage] = useState('');

  const departments = ['all', ...new Set(studentList.map((student) => student.department))];

  const studentRows = useMemo(() => {
    return studentList
      .map((student) => {
        const studentRecords = records.filter((record) => record.studentId === student.id);
        const present = studentRecords.filter((record) => record.status === 'present' || record.status === 'late').length;
        const total = studentRecords.length || 1;
        const percentage = Math.round((present / total) * 100);
        return { ...student, percentage, status: percentage >= 75 ? 'Good' : 'Low' };
      })
      .filter((student) => {
        const matchesQuery = !query || `${student.name} ${student.id}`.toLowerCase().includes(query.toLowerCase());
        const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || student.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesQuery && matchesDepartment && matchesStatus;
      });
  }, [departmentFilter, query, records, statusFilter, studentList]);

  const selectedStudentData = selectedStudent
    ? studentRows.find((student) => student.id === selectedStudent) || null
    : null;

  const handleAddStudent = (event) => {
    event.preventDefault();

    if (studentList.length >= MAX_REGISTERED_STUDENTS) {
      setMessage('Maximum 10 students allowed.');
      return;
    }

    const cleanedId = form.studentId.trim();
    const cleanedName = form.name.trim();

    if (!cleanedId || !cleanedName) {
      setMessage('Student ID and Name are required.');
      return;
    }

    const nextStudent = {
      id: `STU-${String(studentList.length + 1).padStart(4, '0')}`,
      studentId: cleanedId,
      name: cleanedName,
      department: form.department,
      role: 'student',
      avatar: '👩‍🎓',
      year: form.year,
      section: 'A',
      password: 'demo123',
    };

    setStudentList((current) => [...current, nextStudent]);
    setForm({ studentId: '', name: '', department: 'Computer Science', year: 'I Year' });
    setMessage('');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Student directory</p>
          <h1>Students</h1>
        </div>
      </div>

      <div className="admin-table-card" style={{ marginBottom: '1.5rem' }}>
        <h2>Register Students</h2>
        <form onSubmit={handleAddStudent} style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="admin-filter-wrap">
            <label htmlFor="studentId">Student ID</label>
            <input id="studentId" type="text" value={form.studentId} onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))} placeholder="e.g. STU-1007" />
          </div>
          <div className="admin-filter-wrap">
            <label htmlFor="studentName">Student Name</label>
            <input id="studentName" type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" />
          </div>
          <div className="admin-filter-wrap">
            <label htmlFor="department">Department</label>
            <select id="department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}>
              {['Computer Science', 'Robotics and Automation', 'Mechanical', 'Electronics', 'Information Technology'].map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
          <div className="admin-filter-wrap">
            <label htmlFor="year">Year</label>
            <select id="year" value={form.year} onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}>
              {['I Year', 'II Year', 'III Year', 'IV Year'].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button type="submit" className="admin-primary-btn" disabled={studentList.length >= MAX_REGISTERED_STUDENTS}>Add Student</button>
          </div>
        </form>
        {message && <div className="error-box" style={{ marginTop: '0.75rem' }}>{message}</div>}
        <p className="admin-subtitle" style={{ marginTop: '0.75rem' }}>
          Registered: {studentList.length} / {MAX_REGISTERED_STUDENTS}. Maximum 10 students allowed.
        </p>
      </div>

      <div className="admin-table-card">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <span>🔎</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search student or ID"
            />
          </div>

          <div className="admin-filter-wrap">
            <label htmlFor="departmentFilter">Department</label>
            <select id="departmentFilter" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department === 'all' ? 'All Departments' : department}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-filter-wrap">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All Status</option>
              <option value="good">Good</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Attendance %</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {studentRows.map((student) => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>{student.percentage}%</td>
                <td>
                  <span className={`admin-status-badge ${student.status === 'Good' ? 'good' : 'low'}`}>{student.status}</span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button type="button" className="admin-view-btn" onClick={() => setSelectedStudent(student.id)}>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudentData && (
        <div className="admin-detail-box">
          <h3>{selectedStudentData.name}</h3>
          <p>
            {selectedStudentData.department} · {selectedStudentData.year} · {selectedStudentData.id}
          </p>
          <p>Attendance: {selectedStudentData.percentage}% · Status: {selectedStudentData.status}</p>
          <p>Courses: {subjectCatalog.slice(0, 3).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
