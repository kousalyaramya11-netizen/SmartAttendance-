import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';

async function getTodaysAttendanceSummary() {
  const today = new Date().toISOString().slice(0, 10);

  const recordsResult = await db.query(
    `SELECT ar.*, u."studentId" AS studentid, u.name AS student_name
     FROM attendance_records ar
     LEFT JOIN users u ON u."studentId" = ar."studentId"
     WHERE ar.date = $1
     ORDER BY ar."recordedAt" DESC`,
    [today],
  );

  const records = recordsResult.rows || [];
  const totalStudents = new Set(records.map((row) => row.studentid)).size;
  const present = records.filter((row) => row.status === 'present' || row.status === 'late').length;
  const absent = records.filter((row) => row.status === 'absent').length;

  return {
    summary: {
      totalStudents,
      present,
      absent,
    },
    records: records.map((row) => ({
      ...row,
      status: row.status,
      studentid: row.studentid,
      student_name: row.student_name,
      date: row.date,
      time: row.recordedat ? new Date(row.recordedat).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—',
    })),
  };
}

async function verifyAttendance({ studentId, sessionToken, userId }) {
  const sessionResult = await db.query('SELECT * FROM attendance_sessions WHERE token = $1', [sessionToken]);

  if (sessionResult.rows.length === 0) {
    return { status: 'error', code: 'INVALID_SESSION', message: 'Invalid Attendance Session' };
  }

  const session = sessionResult.rows[0];

  if (session.status !== 'active') {
    return { status: 'error', code: 'SESSION_EXPIRED', message: 'Attendance Session Expired' };
  }

  const now = new Date();
  const expiryTime = new Date(session.expirytime);

  if (now > expiryTime) {
    await db.query('UPDATE attendance_sessions SET status = $1 WHERE id = $2', ['expired', session.id]);
    return { status: 'error', code: 'SESSION_EXPIRED', message: 'Attendance Session Expired' };
  }

  const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (userResult.rows.length === 0) {
    return { status: 'error', code: 'UNAUTHORIZED', message: 'You are not authorized for this session' };
  }

  const user = userResult.rows[0];
  if (user.role !== 'student' || user.studentid !== studentId) {
    return { status: 'error', code: 'UNAUTHORIZED', message: 'You are not authorized for this session' };
  }

  const duplicateCheck = await db.query(
    'SELECT * FROM attendance_records WHERE "studentId" = $1 AND "sessionId" = $2',
    [studentId, session.id],
  );

  if (duplicateCheck.rows.length > 0) {
    return { status: 'error', code: 'ALREADY_RECORDED', message: 'Attendance Already Recorded' };
  }

  const recordResult = await db.query(
    `INSERT INTO attendance_records (id, "studentId", "sessionId", subject, date, "recordedAt", "verificationMethod", status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'present')
     RETURNING *`,
    [uuidv4(), studentId, session.id, session.subject, new Date().toISOString().slice(0, 10), new Date().toISOString(), 'QR Session'],
  );

  return {
    status: 'success',
    code: 'SUCCESS',
    message: 'Attendance Marked Successfully',
    record: recordResult.rows[0],
  };
}

export { verifyAttendance, getTodaysAttendanceSummary };
