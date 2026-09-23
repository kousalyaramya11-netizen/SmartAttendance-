import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateSessionToken } from '../server/utils/token.js';
import * as attendanceService from '../server/services/attendanceService.js';

describe('Server Utility & Service Exports', () => {
  it('should generate a 48-character hex session token', () => {
    const token = generateSessionToken();
    assert.ok(typeof token === 'string', 'Token should be a string');
    assert.equal(token.length, 48, '24 random bytes should produce a 48 hex character token');
    assert.match(token, /^[0-9a-f]{48}$/i, 'Token should be valid hexadecimal string');
  });

  it('should generate unique tokens on consecutive calls', () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();
    assert.notEqual(token1, token2, 'Two generated tokens should be distinct');
  });

  it('attendanceService should export required functions', () => {
    assert.equal(typeof attendanceService.verifyAttendance, 'function', 'verifyAttendance must be exported');
    assert.equal(typeof attendanceService.getTodaysAttendanceSummary, 'function', 'getTodaysAttendanceSummary must be exported');
  });
});
