import { describe, it, expect } from 'vitest';
import { USER_ROLES, ROLE_LABELS, getRoleLabel } from '../../types/roles';

describe('USER_ROLES', () => {
  it('has ADMIN as 1', () => expect(USER_ROLES.ADMIN).toBe(1));
  it('has USER as 2', () => expect(USER_ROLES.USER).toBe(2));
  it('has DOCTOR as 3', () => expect(USER_ROLES.DOCTOR).toBe(3));
  it('has NURSE as 4', () => expect(USER_ROLES.NURSE).toBe(4));
  it('has RECEPTIONIST as 5', () => expect(USER_ROLES.RECEPTIONIST).toBe(5));
  it('has IT_SUPPORT as 9', () => expect(USER_ROLES.IT_SUPPORT).toBe(9));
});

describe('ROLE_LABELS', () => {
  it('maps ADMIN to Administrador', () => {
    expect(ROLE_LABELS[USER_ROLES.ADMIN]).toBe('Administrador');
  });

  it('maps DOCTOR to Médico', () => {
    expect(ROLE_LABELS[USER_ROLES.DOCTOR]).toBe('Médico');
  });

  it('maps RECEPTIONIST to Recepcionista', () => {
    expect(ROLE_LABELS[USER_ROLES.RECEPTIONIST]).toBe('Recepcionista');
  });

  it('maps IT_SUPPORT to Suporte de TI', () => {
    expect(ROLE_LABELS[USER_ROLES.IT_SUPPORT]).toBe('Suporte de TI');
  });
});

describe('getRoleLabel', () => {
  it('returns the correct label for a known roleId', () => {
    expect(getRoleLabel(USER_ROLES.ADMIN)).toBe('Administrador');
    expect(getRoleLabel(USER_ROLES.DOCTOR)).toBe('Médico');
    expect(getRoleLabel(USER_ROLES.NURSE)).toBe('Enfermeiro(a)');
  });

  it('returns "Desconhecido" for an unknown roleId', () => {
    expect(getRoleLabel(999)).toBe('Desconhecido');
  });

  it('works with numeric literal', () => {
    expect(getRoleLabel(5)).toBe('Recepcionista');
  });
});
