import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { verifyAttendance, getTodaysAttendanceSummary } from '../services/attendanceService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/today', async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Teacher access required.' });
  }

  try {
    const summary = await getTodaysAttendanceSummary();
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load today\'s attendance.' });
  }
});

router.post('/verify', async (req, res) => {
  const { sessionToken, studentId } = req.body || {};

  if (!sessionToken) {
    return res.status(400).json({ message: 'Attendance session token is required.' });
  }

  try {
    const summary = await verifyAttendance({
      studentId: studentId || req.user.studentid,
      sessionToken,
      userId: req.user.id,
    });

    if (summary.status === 'success') {
      return res.status(200).json(summary);
    }

    if (summary.code === 'INVALID_SESSION') {
      return res.status(400).json(summary);
    }

    if (summary.code === 'SESSION_EXPIRED') {
      return res.status(410).json(summary);
    }

    if (summary.code === 'ALREADY_RECORDED') {
      return res.status(409).json(summary);
    }

    return res.status(403).json(summary);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to verify attendance.' });
  }
});

export default router;
