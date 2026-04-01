import { describe, it, expect } from 'vitest';
import { formatCep } from '../../utils/formatCep';

describe('formatCep', () => {
  it('formats 8 digits correctly', () => {
    expect(formatCep('12345678')).toBe('12345-678');
  });

  it('strips non-numeric characters before formatting', () => {
    expect(formatCep('12345-678')).toBe('12345-678');
  });

  it('truncates extra digits', () => {
    expect(formatCep('123456789')).toBe('12345-678');
  });

  it('handles partial input', () => {
    expect(formatCep('12345')).toBe('12345');
    expect(formatCep('123456')).toBe('12345-6');
  });

  it('returns empty string for empty input', () => {
    expect(formatCep('')).toBe('');
  });
});
