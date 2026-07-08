import { describe, it, expect } from 'vitest';
import { formatTime } from '../../utils/formatTime';

describe('formatTime', () => {
  it('returns HH:mm as-is when input is exactly 5 chars', () => {
    expect(formatTime('14:30')).toBe('14:30');
  });

  it('formats ISO datetime string in Sao Paulo time', () => {
    expect(formatTime('2024-01-15T14:30:00.000Z')).toBe('11:30');
  });

  it('formats stored UTC appointment time back to Sao Paulo time', () => {
    expect(formatTime('2026-07-08T11:00:00.000Z')).toBe('08:00');
  });

  it('extracts HH:mm from datetime with offset', () => {
    expect(formatTime('2024-01-15T09:05:00-03:00')).toBe('09:05');
  });

  it('extracts HH:mm from space-separated datetime', () => {
    expect(formatTime('2024-01-15 08:00:00')).toBe('08:00');
  });

  it('returns empty string when no HH:mm pattern found', () => {
    expect(formatTime('no-time-here')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(formatTime('')).toBe('');
  });

  it('handles midnight time', () => {
    expect(formatTime('00:00')).toBe('00:00');
  });
});
