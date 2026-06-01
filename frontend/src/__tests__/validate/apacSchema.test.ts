import { describe, it, expect } from 'vitest';
import { apacPrintSchema } from '../../validate/apac.schema';

const validData = {
  f3_nome_paciente: 'Maria Oliveira',
  f1_nome_estab: 'ADQPAL - ASSOCIAÇÃO',
  f41_prof_sol: 'Dr. Luiz Paulo',
  f18_proc: ['0', '3', '0', '1', '0', '0', '5', '9'],
};

describe('apacPrintSchema', () => {
  it('accepts valid data', () => {
    const result = apacPrintSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects empty patient name', () => {
    const result = apacPrintSchema.safeParse({ ...validData, f3_nome_paciente: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do paciente.');
  });

  it('rejects empty establishment name', () => {
    const result = apacPrintSchema.safeParse({ ...validData, f1_nome_estab: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do estabelecimento.');
  });

  it('rejects empty professional name', () => {
    const result = apacPrintSchema.safeParse({ ...validData, f41_prof_sol: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do profissional solicitante.');
  });

  it('rejects empty procedure code', () => {
    const result = apacPrintSchema.safeParse({ ...validData, f18_proc: ['', '', '', '', '', '', '', ''] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o código do procedimento principal.');
  });

  it('rejects all-empty procedure code array', () => {
    const result = apacPrintSchema.safeParse({ ...validData, f18_proc: Array(8).fill('') });
    expect(result.success).toBe(false);
  });

  it('accepts partially filled procedure code', () => {
    const result = apacPrintSchema.safeParse({ ...validData, f18_proc: ['0', '3', '', '', '', '', '', ''] });
    expect(result.success).toBe(true);
  });
});
