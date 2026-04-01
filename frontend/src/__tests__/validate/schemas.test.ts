import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../validate/login.schema';
import { forgotPasswordSchema } from '../../validate/forgotPassword.schema';
import { newPacientSchema } from '../../validate/newPacient';
import { editPacientSchema } from '../../validate/editPacient';

// ── loginSchema ───────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true);
  });

  it('rejects missing email', () => {
    expect(loginSchema.safeParse({ password: '123456' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: '123456' }).success).toBe(false);
  });

  it('rejects missing password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com' }).success).toBe(false);
  });
});

// ── forgotPasswordSchema ──────────────────────────────────────────────────────

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@clinic.com' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'invalid' }).success).toBe(false);
  });

  it('rejects empty email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

// ── newPacientSchema ──────────────────────────────────────────────────────────

const basePatient = {
  name: 'Maria Silva',
  phone: '11999999999',
  gender: 'feminino',
  agreement: 'Unimed',
  cpf: '123.456.789-09',
};

describe('newPacientSchema', () => {
  it('accepts valid patient data', () => {
    expect(newPacientSchema.safeParse(basePatient).success).toBe(true);
  });

  it('rejects missing name', () => {
    const { name: _, ...rest } = basePatient;
    expect(newPacientSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects invalid CPF format', () => {
    expect(newPacientSchema.safeParse({ ...basePatient, cpf: '11111111111' }).success).toBe(false);
  });

  it('rejects invalid email when provided', () => {
    expect(newPacientSchema.safeParse({ ...basePatient, email: 'bad-email' }).success).toBe(false);
  });

  it('accepts null/omitted optional fields', () => {
    const result = newPacientSchema.safeParse({ ...basePatient, email: null, dateOfBirth: null });
    expect(result.success).toBe(true);
  });
});

// ── editPacientSchema ─────────────────────────────────────────────────────────

describe('editPacientSchema', () => {
  it('accepts full edit payload', () => {
    const result = editPacientSchema.safeParse({
      name: 'João Costa',
      gender: 'masculino',
      agreement: 'SulAmérica',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    expect(editPacientSchema.safeParse({ gender: 'masculino', agreement: 'Unimed' }).success).toBe(false);
  });

  it('rejects invalid CPF when provided', () => {
    expect(
      editPacientSchema.safeParse({ name: 'X', gender: 'outro', agreement: 'Y', cpf: 'bad' }).success,
    ).toBe(false);
  });

  it('accepts null CPF', () => {
    expect(
      editPacientSchema.safeParse({ name: 'X', gender: 'outro', agreement: 'Y', cpf: null }).success,
    ).toBe(true);
  });
});
