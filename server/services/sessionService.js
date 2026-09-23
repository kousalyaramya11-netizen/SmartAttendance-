import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import { generateSessionToken } from '../utils/token.js';
import { generateQrPng } from '../utils/qr.js';

async function createSession({ subject, durationMinutes, adminId }) {
  const startTime = new Date();
  const expiryTime = new Date(startTime.getTime() + Number(durationMinutes) * 60 * 1000);
  const token = generateSessionToken();
  const id = uuidv4();

  const result = await db.query(
    `INSERT INTO attendance_sessions (id, subject, sessionDate, startTime, expiryTime, token, createdByAdminId, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'active') RETURNING *`,
    [id, subject, startTime.toISOString().slice(0, 10), startTime.toISOString(), expiryTime.toISOString(), token, adminId],
  );

  const qrCode = await generateQrPng(JSON.stringify({
    sessionId: result.rows[0].id,
    token: result.rows[0].token,
    subject: result.rows[0].subject,
    expiryTime: result.rows[0].expirytime,
  }));

  return { session: result.rows[0], qrCode };
}

async function getActiveSessions() {
  const result = await db.query('SELECT * FROM attendance_sessions WHERE status = $1 ORDER BY "createdAt" DESC', ['active']);
  return result.rows;
}

async function endSession(sessionId) {
  const result = await db.query(
    `UPDATE attendance_sessions
     SET status = 'ended', "expiryTime" = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId],
  );

  return result.rows[0];
}

async function getAttendeesBySession(sessionId) {
  const result = await db.query(
    `SELECT ar.*, u."studentId", u.name
     FROM attendance_records ar
     LEFT JOIN users u ON u."studentId" = ar."studentId"
     WHERE ar."sessionId" = $1
     ORDER BY ar."recordedAt" DESC`,
    [sessionId],
  );

  return result.rows;
}

export { createSession, getActiveSessions, endSession, getAttendeesBySession };
