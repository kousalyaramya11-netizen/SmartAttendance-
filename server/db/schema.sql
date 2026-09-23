CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studentId VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
  passwordHash TEXT NOT NULL,
  department VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(255) NOT NULL,
  sessionDate DATE NOT NULL,
  startTime TIMESTAMP NOT NULL,
  expiryTime TIMESTAMP NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  createdByAdminId UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'expired')),
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studentId VARCHAR(50) NOT NULL,
  sessionId UUID NOT NULL REFERENCES attendance_sessions(id),
  subject VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  recordedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  verificationMethod VARCHAR(50) NOT NULL DEFAULT 'QR Session',
  status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent')),
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE (studentId, sessionId)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actorId UUID,
  action VARCHAR(255) NOT NULL,
  entityType VARCHAR(255) NOT NULL,
  entityId VARCHAR(255),
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT NOW()
);
