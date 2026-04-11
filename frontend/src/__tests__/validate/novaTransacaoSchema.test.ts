import { describe, it, expect } from 'vitest';
import { novaTransacaoSchema } from '../../validate/novaTransacao.schema';

const validData = {
  type: 'INCOME' as const,
  accountId: 'acc-uuid-123',
  categoryId: 'cat-uuid-456',
  description: 'Consulta particular',
  amount: '150.00',
  status: 'CONFIRMED' as const,
  paymentMethod: 'PIX' as const,
  dueDate: '2026-04-10',
};

describe('novaTransacaoSchema', () => {
  it('validates correct transaction data', () => {
    const result = novaTransacaoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts optional notes field', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, notes: 'Paciente particular' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid transaction type', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, type: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('rejects empty accountId', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, accountId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Conta é obrigatória');
    }
  });

  it('rejects empty categoryId', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, categoryId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Categoria é obrigatória');
    }
  });

  it('rejects description longer than 200 chars', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, description: 'A'.repeat(201) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Máximo 200 caracteres');
    }
  });

  it('rejects zero amount', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, amount: '0' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Valor deve ser maior que zero');
    }
  });

  it('rejects negative amount', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, amount: '-10' });
    expect(result.success).toBe(false);
  });

  it('accepts amount with comma (Brazilian format)', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, amount: '1500,50' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, status: 'UNKNOWN' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid paymentMethod', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, paymentMethod: 'BITCOIN' });
    expect(result.success).toBe(false);
  });

  it('rejects empty dueDate', () => {
    const result = novaTransacaoSchema.safeParse({ ...validData, dueDate: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Data é obrigatória');
    }
  });

  it('validates all transaction types', () => {
    (['INCOME', 'EXPENSE', 'TRANSFER'] as const).forEach((type) => {
      const result = novaTransacaoSchema.safeParse({ ...validData, type });
      expect(result.success).toBe(true);
    });
  });

  it('validates all payment methods', () => {
    const methods = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER', 'INSURANCE', 'OTHER'] as const;
    methods.forEach((paymentMethod) => {
      const result = novaTransacaoSchema.safeParse({ ...validData, paymentMethod });
      expect(result.success).toBe(true);
    });
  });
});
