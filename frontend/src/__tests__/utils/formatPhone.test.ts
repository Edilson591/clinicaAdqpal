import { describe, it, expect } from 'vitest';
import { formatPhone } from '../../utils/formatPhone';

describe('formatPhone', () => {
  it('formats 11-digit mobile number', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('strips non-numeric characters before formatting', () => {
    expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });

  it('truncates to 11 digits', () => {
    expect(formatPhone('119876543219999')).toBe('(11) 98765-4321');
  });

  it('handles partial input', () => {
    expect(formatPhone('11')).toBe('11');
    expect(formatPhone('119')).toBe('(11) 9');
  });

  it('returns empty string for empty input', () => {
    expect(formatPhone('')).toBe('');
  });
});
