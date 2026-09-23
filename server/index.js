import bcrypt from 'bcryptjs';
import app from './app.js';
import config from './config/index.js';
import db from './db/index.js';

async function ensureDefaultAdmin() {
  const adminStudentId = process.env.ADMIN_STUDENT_ID || 'ADMIN-001';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Dr. Maya Nair';
  const adminDepartment = process.env.ADMIN_DEPARTMENT || 'Faculty Office';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartattendance.local';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.query(
    `INSERT INTO users (studentid, name, email, role, passwordhash, department)
     VALUES ($1, $2, $3, 'admin', $4, $5)
     ON CONFLICT (studentid) DO NOTHING`,
    [adminStudentId, adminName, adminEmail, passwordHash, adminDepartment]
  );
}

async function bootstrap() {
  try {
    await db.query('SELECT 1');
    await ensureDefaultAdmin();
    app.listen(config.port, () => {
      console.log(`Smart Attendance API running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Database connection failed. Configure PostgreSQL and set DATABASE_URL in a local .env file.');
    console.error(error.message);
    process.exit(1);
  }
}

bootstrap();
