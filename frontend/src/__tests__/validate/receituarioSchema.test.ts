import { describe, it, expect } from 'vitest';
import {
  receituarioExamesSchema,
  receituarioReceitaSchema,
  receituarioControleSchema,
  receituarioEncaminhamentoSchema,
  receituarioAutorizacaoSchema,
} from '../../validate/receituario.schema';

const baseExames = {
  examPatient: 'Maria Oliveira',
  examJustificativa: 'Rotina',
  examSelected: ['Hemograma Completo', 'Glicemia de Jejum'],
};

const baseReceita = {
  patient: 'João Silva',
  medicamentos: 'Amoxicilina 500mg — 1 cápsula 3x ao dia',
};

const baseControle = {
  cePacNome: 'Carlos Santos',
  cePrescricao: 'Clonazepam 2mg — 1 comprimido ao dia',
};

const baseEncaminhamento = {
  encPatient: 'Ana Costa',
  encEspec: 'Cirurgia Geral',
  encDest: '',
  encJust: 'Avaliação',
};

const baseAutorizacao = {
  autNome: 'Pedro Alves',
  autDn: '15/03/1985',
  autCpf: '123.456.789-00',
  autRg: '1234567',
  autSus: '123.456.789.000.001',
  autTipo: 'MAPA',
};

describe('receituarioExamesSchema', () => {
  it('accepts valid data', () => {
    const result = receituarioExamesSchema.safeParse(baseExames);
    expect(result.success).toBe(true);
  });

  it('rejects empty patient name', () => {
    const result = receituarioExamesSchema.safeParse({ ...baseExames, examPatient: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do paciente.');
  });

  it('rejects empty justificativa', () => {
    const result = receituarioExamesSchema.safeParse({ ...baseExames, examJustificativa: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe a justificativa.');
  });

  it('rejects no exam selected', () => {
    const result = receituarioExamesSchema.safeParse({ ...baseExames, examSelected: [] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Selecione pelo menos um exame.');
  });
});

describe('receituarioReceitaSchema', () => {
  it('accepts valid data', () => {
    const result = receituarioReceitaSchema.safeParse(baseReceita);
    expect(result.success).toBe(true);
  });

  it('rejects empty patient', () => {
    const result = receituarioReceitaSchema.safeParse({ ...baseReceita, patient: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do paciente.');
  });

  it('rejects empty medicamentos', () => {
    const result = receituarioReceitaSchema.safeParse({ ...baseReceita, medicamentos: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe os medicamentos prescritos.');
  });
});

describe('receituarioControleSchema', () => {
  it('accepts valid data', () => {
    const result = receituarioControleSchema.safeParse(baseControle);
    expect(result.success).toBe(true);
  });

  it('rejects empty paciente name', () => {
    const result = receituarioControleSchema.safeParse({ ...baseControle, cePacNome: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do paciente.');
  });

  it('rejects empty prescricao', () => {
    const result = receituarioControleSchema.safeParse({ ...baseControle, cePrescricao: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe a prescrição.');
  });
});

describe('receituarioEncaminhamentoSchema', () => {
  it('accepts valid data with especialidade', () => {
    const result = receituarioEncaminhamentoSchema.safeParse(baseEncaminhamento);
    expect(result.success).toBe(true);
  });

  it('accepts valid data with destino instead of especialidade', () => {
    const result = receituarioEncaminhamentoSchema.safeParse({
      ...baseEncaminhamento,
      encEspec: '',
      encDest: 'Secretaria Municipal de Saúde',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty patient', () => {
    const result = receituarioEncaminhamentoSchema.safeParse({ ...baseEncaminhamento, encPatient: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do paciente.');
  });

  it('rejects missing especialidade and destino', () => {
    const result = receituarioEncaminhamentoSchema.safeParse({
      ...baseEncaminhamento,
      encEspec: '',
      encDest: '',
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe('Informe a especialidade ou o destino do encaminhamento.');
  });

  it('rejects empty justificativa', () => {
    const result = receituarioEncaminhamentoSchema.safeParse({ ...baseEncaminhamento, encJust: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe a justificativa.');
  });
});

describe('receituarioAutorizacaoSchema', () => {
  it('accepts valid data', () => {
    const result = receituarioAutorizacaoSchema.safeParse(baseAutorizacao);
    expect(result.success).toBe(true);
  });

  it('rejects empty nome', () => {
    const result = receituarioAutorizacaoSchema.safeParse({ ...baseAutorizacao, autNome: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o nome do paciente.');
  });

  it('rejects empty DN', () => {
    const result = receituarioAutorizacaoSchema.safeParse({ ...baseAutorizacao, autDn: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe a data de nascimento.');
  });

  it('rejects empty CPF', () => {
    const result = receituarioAutorizacaoSchema.safeParse({ ...baseAutorizacao, autCpf: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o CPF do paciente.');
  });

  it('rejects empty RG', () => {
    const result = receituarioAutorizacaoSchema.safeParse({ ...baseAutorizacao, autRg: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o RG do paciente.');
  });

  it('rejects empty SUS', () => {
    const result = receituarioAutorizacaoSchema.safeParse({ ...baseAutorizacao, autSus: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o número do Cartão SUS.');
  });

  it('rejects empty tipo', () => {
    const result = receituarioAutorizacaoSchema.safeParse({ ...baseAutorizacao, autTipo: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe('Informe o tipo de exame.');
  });
});
