import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import db from '../db/index.js';

async function loginUser(studentId, password) {
  const result = await db.query('SELECT * FROM users WHERE "studentId" = $1', [studentId]);

  if (result.rows.length === 0) {
    return { success: false, message: 'Invalid credentials.' };
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.passwordhash);

  if (!validPassword) {
    return { success: false, message: 'Invalid credentials.' };
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '8h' });

  return {
    success: true,
    token,
    user: {
      id: user.id,
      studentId: user.studentid,
      name: user.name,
      department: user.department,
      role: user.role,
      email: user.email,
    },
  };
}

export { loginUser };
