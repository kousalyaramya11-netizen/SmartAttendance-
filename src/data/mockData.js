export const studentProfile = {
  id: 'STU-1001',
  studentId: 'STU-1001',
  name: 'Kousalya K',
  department: 'Robotics and Automation',
  role: 'student',
  avatar: '👩‍🎓',
  year: 'III Year',
  section: 'A',
  password: 'demo123',
};

export const adminProfile = {
  id: 'ADMIN-001',
  studentId: 'ADMIN-001',
  name: 'Dr. Maya Nair',
  department: 'Faculty Office',
  role: 'admin',
  avatar: '👩‍🏫',
  year: 'Faculty',
  section: 'Admin',
  password: 'admin123',
};

export const subjectCatalog = [
  'Robotics Fundamentals',
  'Embedded Systems',
  'Computer Vision',
  'Machine Learning',
  'IoT Lab',
];

export const MAX_REGISTERED_STUDENTS = 10;

export const allStudents = [
  { id: 'STU-1001', studentId: 'STU-1001', name: 'Kousalya K', department: 'Robotics and Automation', role: 'student', avatar: '👩‍🎓', year: 'III Year', section: 'A', password: 'demo123' },
  { id: 'STU-1002', studentId: 'STU-1002', name: 'Divya R', department: 'Computer Science', role: 'student', avatar: '👩‍🎓', year: 'II Year', section: 'B', password: 'demo123' },
  { id: 'STU-1003', studentId: 'STU-1003', name: 'Aarav S', department: 'Mechanical', role: 'student', avatar: '👨‍🎓', year: 'III Year', section: 'A', password: 'demo123' },
  { id: 'STU-1004', studentId: 'STU-1004', name: 'Neha P', department: 'Electronics', role: 'student', avatar: '👩‍🎓', year: 'II Year', section: 'C', password: 'demo123' },
  { id: 'STU-1005', studentId: 'STU-1005', name: 'Vikram T', department: 'Robotics and Automation', role: 'student', avatar: '👨‍🎓', year: 'IV Year', section: 'A', password: 'demo123' },
  { id: 'STU-1006', studentId: 'STU-1006', name: 'Meera I', department: 'Information Technology', role: 'student', avatar: '👩‍🎓', year: 'III Year', section: 'D', password: 'demo123' },
];

export const registeredStudents = allStudents.slice(0, MAX_REGISTERED_STUDENTS);

export const users = [...allStudents, adminProfile];

export const courses = subjectCatalog.map((subject, index) => ({
  id: `SUB-${index + 1}`,
  name: subject,
  teacher: 'Faculty Panel',
  schedule: ['09:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '03:30 PM'][index],
}));

function getRelativeDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
}

function getDayName(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

const demoAttendanceBlueprint = [
  { studentId: 'STU-1001', entries: [
    { subject: 'Robotics Fundamentals', offset: -7, status: 'present', time: '09:15 AM', method: 'Face Recognition' },
    { subject: 'Embedded Systems', offset: -6, status: 'present', time: '10:20 AM', method: 'Face Recognition' },
    { subject: 'Computer Vision', offset: -5, status: 'absent', time: '09:40 AM', method: 'Manual' },
    { subject: 'Machine Learning', offset: -4, status: 'present', time: '11:00 AM', method: 'Face Recognition' },
    { subject: 'IoT Lab', offset: -3, status: 'present', time: '02:15 PM', method: 'Face Recognition' },
    { subject: 'Robotics Fundamentals', offset: -2, status: 'late', time: '09:35 AM', method: 'Face Recognition' },
    { subject: 'Embedded Systems', offset: -1, status: 'absent', time: '10:05 AM', method: 'Manual' },
    { subject: 'Computer Vision', offset: 0, status: 'present', time: '09:30 AM', method: 'Face Recognition' },
  ]},
  { studentId: 'STU-1002', entries: [
    { subject: 'Robotics Fundamentals', offset: -6, status: 'present', time: '09:05 AM', method: 'Face Recognition' },
    { subject: 'Embedded Systems', offset: -5, status: 'absent', time: '10:10 AM', method: 'Manual' },
    { subject: 'Computer Vision', offset: -4, status: 'late', time: '09:55 AM', method: 'Face Recognition' },
    { subject: 'Machine Learning', offset: -2, status: 'present', time: '11:25 AM', method: 'Face Recognition' },
    { subject: 'IoT Lab', offset: -1, status: 'absent', time: '02:00 PM', method: 'Manual' },
    { subject: 'Robotics Fundamentals', offset: 0, status: 'present', time: '09:20 AM', method: 'Face Recognition' },
  ]},
  { studentId: 'STU-1003', entries: [
    { subject: 'Robotics Fundamentals', offset: -7, status: 'absent', time: '09:10 AM', method: 'Manual' },
    { subject: 'Embedded Systems', offset: -6, status: 'present', time: '10:25 AM', method: 'Face Recognition' },
    { subject: 'Computer Vision', offset: -4, status: 'present', time: '09:30 AM', method: 'Face Recognition' },
    { subject: 'Machine Learning', offset: -3, status: 'late', time: '11:15 AM', method: 'Face Recognition' },
    { subject: 'IoT Lab', offset: -1, status: 'present', time: '02:40 PM', method: 'Face Recognition' },
    { subject: 'Robotics Fundamentals', offset: 0, status: 'absent', time: '09:12 AM', method: 'Manual' },
  ]},
  { studentId: 'STU-1004', entries: [
    { subject: 'Embedded Systems', offset: -7, status: 'present', time: '10:05 AM', method: 'Face Recognition' },
    { subject: 'Computer Vision', offset: -5, status: 'present', time: '09:25 AM', method: 'Face Recognition' },
    { subject: 'Machine Learning', offset: -4, status: 'late', time: '11:20 AM', method: 'Face Recognition' },
    { subject: 'IoT Lab', offset: -2, status: 'absent', time: '02:10 PM', method: 'Manual' },
    { subject: 'Embedded Systems', offset: -1, status: 'present', time: '10:15 AM', method: 'Face Recognition' },
    { subject: 'Computer Vision', offset: 0, status: 'present', time: '09:35 AM', method: 'Face Recognition' },
  ]},
  { studentId: 'STU-1005', entries: [
    { subject: 'Robotics Fundamentals', offset: -7, status: 'present', time: '08:55 AM', method: 'Face Recognition' },
    { subject: 'Embedded Systems', offset: -6, status: 'present', time: '10:00 AM', method: 'Face Recognition' },
    { subject: 'Computer Vision', offset: -4, status: 'absent', time: '09:10 AM', method: 'Manual' },
    { subject: 'Machine Learning', offset: -3, status: 'present', time: '11:05 AM', method: 'Face Recognition' },
    { subject: 'IoT Lab', offset: -1, status: 'late', time: '02:25 PM', method: 'Face Recognition' },
    { subject: 'Robotics Fundamentals', offset: 0, status: 'present', time: '09:00 AM', method: 'Face Recognition' },
  ]},
  { studentId: 'STU-1006', entries: [
    { subject: 'Robotics Fundamentals', offset: -6, status: 'present', time: '09:18 AM', method: 'Face Recognition' },
    { subject: 'Embedded Systems', offset: -5, status: 'absent', time: '10:20 AM', method: 'Manual' },
    { subject: 'Computer Vision', offset: -3, status: 'late', time: '09:52 AM', method: 'Face Recognition' },
    { subject: 'Machine Learning', offset: -2, status: 'absent', time: '11:00 AM', method: 'Manual' },
    { subject: 'IoT Lab', offset: -1, status: 'present', time: '02:30 PM', method: 'Face Recognition' },
    { subject: 'Robotics Fundamentals', offset: 0, status: 'absent', time: '09:16 AM', method: 'Manual' },
  ]},
];

export const attendanceSeed = demoAttendanceBlueprint.flatMap((studentData, studentIndex) =>
  studentData.entries.map((entry, entryIndex) => ({
    id: `${studentData.studentId}-${studentIndex + 1}-${entryIndex + 1}`,
    studentId: studentData.studentId,
    subject: entry.subject,
    date: getRelativeDate(entry.offset),
    day: getDayName(entry.offset),
    time: entry.time,
    status: entry.status,
    method: entry.method,
  }))
);

export const attendanceRecords = attendanceSeed;

export const getStudentById = (id) => users.find((user) => user.id === id);
export const getCourseById = (id) => courses.find((course) => course.id === id);
export const getTeacherById = () => null;
export const getAttendanceForStudent = (studentId) => attendanceRecords.filter((record) => record.studentId === studentId);
export const getAttendanceForCourse = () => attendanceRecords;
export const getStudentAttendancePercentage = (studentId) => {
  const records = getAttendanceForStudent(studentId);
  if (!records.length) return 0;
  const presentCount = records.filter((record) => record.status === 'present' || record.status === 'late').length;
  return Math.round((presentCount / records.length) * 100);
};
export const getTodayAttendanceForCourse = () => attendanceRecords.filter((record) => record.date === getRelativeDate(0));

