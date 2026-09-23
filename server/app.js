import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();

app.use(cors({
  origin: config.clientOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Attendance API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

export default app;
