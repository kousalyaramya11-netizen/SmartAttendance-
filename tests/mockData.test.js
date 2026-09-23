import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  users,
  courses,
  attendanceRecords,
  getStudentById,
  getAttendanceForStudent,
  getStudentAttendancePercentage,
} from '../src/data/mockData.js';

describe('Mock Data & Analytics Helpers', () => {
  it('should contain a list of users including students and admins', () => {
    assert.ok(Array.isArray(users), 'users must be an array');
    assert.ok(users.length > 0, 'users array should not be empty');

    const hasStudent = users.some((u) => u.role === 'student');
    const hasAdmin = users.some((u) => u.role === 'admin');

    assert.ok(hasStudent, 'should have at least one student');
    assert.ok(hasAdmin, 'should have at least one admin');
  });

  it('should find student by id', () => {
    const student = getStudentById('STU-1001');
    assert.ok(student, 'Student STU-1001 should exist');
    assert.equal(student.id, 'STU-1001');
    assert.equal(student.role, 'student');
  });

  it('should return undefined for non-existent student id', () => {
    const student = getStudentById('NON_EXISTENT_ID');
    assert.equal(student, undefined);
  });

  it('should fetch attendance records for a specific student', () => {
    const records = getAttendanceForStudent('STU-1001');
    assert.ok(Array.isArray(records));
    assert.ok(records.length > 0, 'STU-1001 should have attendance entries');
    for (const record of records) {
      assert.equal(record.studentId, 'STU-1001');
      assert.ok(['present', 'absent', 'late'].includes(record.status));
    }
  });

  it('should return empty array for non-existent student records', () => {
    const records = getAttendanceForStudent('DOES_NOT_EXIST');
    assert.deepEqual(records, []);
  });

  it('should calculate student attendance percentage correctly', () => {
    const percentage = getStudentAttendancePercentage('STU-1001');
    assert.ok(typeof percentage === 'number');
    assert.ok(percentage >= 0 && percentage <= 100, 'Percentage should be between 0 and 100');

    // For a student with no records, should return 0
    const nonExistentPercent = getStudentAttendancePercentage('NO_STUDENT');
    assert.equal(nonExistentPercent, 0);
  });

  it('should have courses with required fields', () => {
    assert.ok(Array.isArray(courses));
    assert.ok(courses.length > 0);
    for (const course of courses) {
      assert.ok(course.id, 'Course must have an ID');
      assert.ok(course.name, 'Course must have a name');
    }
  });
});
