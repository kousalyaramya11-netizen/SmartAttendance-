import pg from 'pg';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';
import { allStudents, adminProfile, attendanceSeed } from '../../src/data/mockData.js';

const { Pool } = pg;

const mockUsers = [...allStudents, adminProfile].map((user) => ({
  ...user,
  passwordhash: bcrypt.hashSync(user.password, 10),
  passwordHash: bcrypt.hashSync(user.password, 10),
  studentid: user.studentId,
  studentId: user.studentId,
  email: `${user.studentId.toLowerCase()}@smartattendance.local`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const mockSessions = [];
const mockAttendanceRecords = [];

function normalizeRows(rows) {
  return rows.map((row) => ({
    ...row,
    expirytime: row.expiryTime || row.expirytime,
    studentid: row.studentId || row.studentid,
    createdAt: row.createdAt || new Date().toISOString(),
    recordedAt: row.recordedAt || new Date().toISOString(),
  }));
}

const fallbackDb = {
  query: async (text, params = []) => {
    const lower = text.toLowerCase();

    if (lower.includes('select 1')) {
      return { rows: [{ '?column?': 1 }], rowCount: 1 };
    }

    if (lower.includes('from users') && lower.includes('where "studentid" = $1')) {
      const target = params[0];
      const rows = mockUsers.filter((user) => user.studentid === target || user.studentId === target);
      return { rows: rows.map((user) => ({ ...user, studentid: user.studentid })), rowCount: rows.length };
    }

    if (lower.includes('from users') && lower.includes('where id = $1')) {
      const target = params[0];
      const rows = mockUsers.filter((user) => user.id === target);
      return { rows: rows.map((user) => ({ ...user, studentid: user.studentid })), rowCount: rows.length };
    }

    if (lower.includes('insert into attendance_sessions')) {
      const [, subject, sessionDate, startTime, expiryTime, token, adminId] = params;
      const record = {
        id: params[0],
        subject,
        sessionDate,
        startTime,
        expiryTime,
        token,
        createdByAdminId: adminId,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      mockSessions.push(record);
      return { rows: [record], rowCount: 1 };
    }

    if (lower.includes('from attendance_sessions') && lower.includes('where status = $1')) {
      const rows = mockSessions.filter((row) => row.status === params[0]);
      return { rows: normalizeRows(rows), rowCount: rows.length };
    }

    if (lower.includes('update attendance_sessions') && lower.includes("set status = 'ended'")) {
      const [sessionId] = params;
      const session = mockSessions.find((item) => item.id === sessionId);
      if (session) {
        session.status = 'ended';
        session.expiryTime = new Date().toISOString();
      }
      return { rows: session ? [session] : [], rowCount: session ? 1 : 0 };
    }

    if (lower.includes('select * from attendance_sessions where token = $1')) {
      const target = params[0];
      const rows = mockSessions.filter((session) => session.token === target);
      return { rows: normalizeRows(rows), rowCount: rows.length };
    }

    if (lower.includes('update attendance_sessions set status = $1 where id = $2')) {
      const [status, sessionId] = params;
      const session = mockSessions.find((item) => item.id === sessionId);
      if (session) session.status = status;
      return { rows: session ? [session] : [], rowCount: session ? 1 : 0 };
    }

    if (lower.includes('select * from attendance_records where "studentid" = $1 and "sessionid" = $2')) {
      const [studentId, sessionId] = params;
      const rows = mockAttendanceRecords.filter((record) => record.studentId === studentId && record.sessionId === sessionId);
      return { rows, rowCount: rows.length };
    }

    if (lower.includes('insert into attendance_records')) {
      const [id, studentId, sessionId, subject, date, recordedAt, verificationMethod] = params;
      const record = {
        id,
        studentId,
        sessionId,
        subject,
        date,
        recordedAt,
        verificationMethod,
        status: 'present',
      };
      mockAttendanceRecords.push(record);
      return { rows: [record], rowCount: 1 };
    }

    if (lower.includes('from attendance_records ar') && lower.includes('left join users u')) {
      const [sessionId] = params;
      const rows = mockAttendanceRecords
        .filter((record) => record.sessionId === sessionId)
        .map((record) => {
          const user = mockUsers.find((student) => student.studentId === record.studentId);
          return {
            ...record,
            studentId: record.studentId,
            name: user?.name ?? 'Unknown Student',
          };
        });
      return { rows, rowCount: rows.length };
    }

    return { rows: [], rowCount: 0 };
  },
};

let db = fallbackDb;

if (config.databaseUrl) {
  const pool = new Pool({ connectionString: config.databaseUrl });
  db = {
    query: (text, params) => pool.query(text, params),
    pool,
  };
}

export default db;
