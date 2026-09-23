import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import config from '../config/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { studentId, password } = req.body || {};

  if (!studentId || !password) {
    return res.status(400).json({ message: 'Student ID and password are required.' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE studentid = $1', [studentId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const user = result.rows[0];
    const storedHash = user.passwordhash || user.passwordHash || user.password_hash || null;
    const passwordMatch = storedHash
      ? (storedHash === password || (storedHash.startsWith('$2') && await bcrypt.compare(password, storedHash)))
      : false;

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '8h' });

    return res.json({
      token,
      user: {
        id: user.id,
        studentId: user.studentid,
        name: user.name,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Authentication failed.' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      studentId: req.user.studentid,
      name: req.user.name,
      department: req.user.department,
      role: req.user.role,
    },
  });
});

export default router;
