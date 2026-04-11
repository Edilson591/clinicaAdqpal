import { describe, it, expect } from 'vitest';
import { patientHistorySchema, HISTORY_TYPE_OPTIONS } from '../../validate/patientHistory.schema';

describe('patientHistorySchema', () => {
  const validData = {
    type: 'EXAME',
    title: 'Resultado do exame de sangue',
    description: 'Hemograma completo dentro dos parâmetros normais.',
  };

  it('validates correct data', () => {
    const result = patientHistorySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects empty type', () => {
    const result = patientHistorySchema.safeParse({ ...validData, type: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Tipo é obrigatório');
    }
  });

  it('rejects title shorter than 3 characters', () => {
    const result = patientHistorySchema.safeParse({ ...validData, title: 'AB' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('3 caracteres');
    }
  });

  it('rejects title longer than 200 characters', () => {
    const longTitle = 'A'.repeat(201);
    const result = patientHistorySchema.safeParse({ ...validData, title: longTitle });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('200 caracteres');
    }
  });

  it('rejects description shorter than 10 characters', () => {
    const result = patientHistorySchema.safeParse({ ...validData, description: 'Curto' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('10 caracteres');
    }
  });

  it('rejects missing fields', () => {
    const result = patientHistorySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('HISTORY_TYPE_OPTIONS', () => {
  it('contains the expected type options', () => {
    const values = HISTORY_TYPE_OPTIONS.map((o) => o.value);
    expect(values).toContain('EXAME');
    expect(values).toContain('PRESCRICAO');
    expect(values).toContain('OBSERVACAO');
    expect(values).toContain('SOLICITACAO');
  });

  it('each option has a value and label', () => {
    HISTORY_TYPE_OPTIONS.forEach((opt) => {
      expect(typeof opt.value).toBe('string');
      expect(typeof opt.label).toBe('string');
    });
  });
});
