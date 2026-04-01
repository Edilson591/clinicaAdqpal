import { describe, it, expect } from 'vitest';
import { formatCpf } from '../../utils/formatCpf';

describe('formatCpf', () => {
  it('formats 11 digits correctly', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01');
  });

  it('strips non-numeric characters before formatting', () => {
    expect(formatCpf('123.456.789-01')).toBe('123.456.789-01');
  });

  it('handles partial input', () => {
    expect(formatCpf('123')).toBe('123');
    expect(formatCpf('1234')).toBe('123.4');
    expect(formatCpf('1234567')).toBe('123.456.7');
  });

  it('returns empty string for empty input', () => {
    expect(formatCpf('')).toBe('');
  });
});
