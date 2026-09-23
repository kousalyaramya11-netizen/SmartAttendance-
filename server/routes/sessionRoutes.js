import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createSession, getActiveSessions, endSession, getAttendeesBySession } from '../services/sessionService.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const { subject, durationMinutes } = req.body || {};

  if (!subject || !durationMinutes) {
    return res.status(400).json({ message: 'Subject and duration are required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create sessions.' });
  }

  try {
    const result = await createSession({
      subject,
      durationMinutes,
      adminId: req.user.id,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create attendance session.' });
  }
});

router.get('/', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  try {
    const sessions = await getActiveSessions();
    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch sessions.' });
  }
});

router.patch('/:id/end', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  try {
    const session = await endSession(req.params.id);
    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to end session.' });
  }
});

router.get('/:id/attendees', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  try {
    const attendees = await getAttendeesBySession(req.params.id);
    return res.json({ attendees });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch attendees.' });
  }
});

export default router;
