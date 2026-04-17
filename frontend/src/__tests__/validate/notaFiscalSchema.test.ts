import { describe, it, expect } from 'vitest';
import { notaFiscalSchema } from '../../validate/notaFiscal.schema';

const valid = {
  patientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  servico: 'Consulta médica',
  valor: '250.00',
};

describe('notaFiscalSchema', () => {
  describe('patientId', () => {
    it('accepts a valid UUID', () => {
      expect(notaFiscalSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects empty string', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, patientId: '' });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].message).toBe('Paciente é obrigatório');
    });

    it('rejects missing field', () => {
      const { patientId: _omit, ...rest } = valid;
      const result = notaFiscalSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });
  });

  describe('servico', () => {
    it('rejects single character', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, servico: 'A' });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].message).toMatch(/pelo menos 2/);
    });

    it('rejects string longer than 255 characters', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, servico: 'A'.repeat(256) });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].message).toMatch(/255/);
    });

    it('accepts exactly 2 characters', () => {
      expect(notaFiscalSchema.safeParse({ ...valid, servico: 'AB' }).success).toBe(true);
    });
  });

  describe('valor', () => {
    it('accepts comma as decimal separator', () => {
      expect(notaFiscalSchema.safeParse({ ...valid, valor: '1.500,00' }).success).toBe(false);
      // comma replaces only first occurrence: "1.500,00" -> "1.500.00" -> NaN
      expect(notaFiscalSchema.safeParse({ ...valid, valor: '150,50' }).success).toBe(true);
    });

    it('accepts integer string', () => {
      expect(notaFiscalSchema.safeParse({ ...valid, valor: '100' }).success).toBe(true);
    });

    it('rejects zero', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, valor: '0' });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].message).toBe('Valor deve ser um número positivo');
    });

    it('rejects negative value', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, valor: '-50' });
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric string', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, valor: 'abc' });
      expect(result.success).toBe(false);
    });

    it('rejects empty string', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, valor: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('observacoes', () => {
    it('is optional — accepts undefined', () => {
      const result = notaFiscalSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('is optional — accepts empty string', () => {
      expect(notaFiscalSchema.safeParse({ ...valid, observacoes: '' }).success).toBe(true);
    });

    it('accepts a normal note', () => {
      expect(
        notaFiscalSchema.safeParse({ ...valid, observacoes: 'Paciente particular' }).success,
      ).toBe(true);
    });

    it('rejects string longer than 2000 characters', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, observacoes: 'x'.repeat(2001) });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].message).toMatch(/longas/);
    });
  });

  describe('type inference', () => {
    it('infers correct data shape on success', () => {
      const result = notaFiscalSchema.safeParse({ ...valid, observacoes: 'obs' });
      if (result.success) {
        expect(typeof result.data.patientId).toBe('string');
        expect(typeof result.data.servico).toBe('string');
        expect(typeof result.data.valor).toBe('string');
        expect(typeof result.data.observacoes).toBe('string');
      }
    });
  });
});
