import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../validate/login.schema';

describe('loginSchema', () => {
  it('validates correct credentials', () => {
    const result = loginSchema.safeParse({ email: 'dr@clinic.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('O e-mail é obrigatório');
    }
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Digite um e-mail válido');
    }
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'dr@clinic.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('A senha é obrigatória');
    }
  });

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('infers correct TypeScript type on success', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'pass' });
    if (result.success) {
      expect(typeof result.data.email).toBe('string');
      expect(typeof result.data.password).toBe('string');
    }
  });
});
