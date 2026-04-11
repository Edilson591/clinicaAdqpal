import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import {
  MEDICAL_RECORD_KEYS,
  useMedicalRecord,
  useMedicalRecordsByPatients,
  useCreateMedicalRecord,
  useDeleteMedicalRecord,
} from '../../hooks/useMedicalRecords';

// ── Service mock ─────────────────────────────────────────────────────────────

vi.mock('../../services/MedicalRecord', () => ({
  medicalRecordService: {
    getAll: vi.fn().mockResolvedValue([]),
    getAllPaginated: vi.fn().mockResolvedValue({ data: [], pagination: {} }),
    getById: vi.fn().mockResolvedValue({ id: 'rec-1', patientId: 'pat-1' }),
    getByPatient: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 'rec-new', patientId: 'pat-1' }),
    update: vi.fn().mockResolvedValue({ id: 'rec-1', patientId: 'pat-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}));

// ── Wrapper ───────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => vi.clearAllMocks());

// ── Query key tests ───────────────────────────────────────────────────────────

describe('MEDICAL_RECORD_KEYS', () => {
  it('all key is ["medical-records"]', () => {
    expect(MEDICAL_RECORD_KEYS.all).toEqual(['medical-records']);
  });

  it('paginated key includes page', () => {
    expect(MEDICAL_RECORD_KEYS.paginated(3)).toEqual(['medical-records', 'page', 3]);
  });

  it('detail key includes id', () => {
    expect(MEDICAL_RECORD_KEYS.detail('abc')).toEqual(['medical-records', 'abc']);
  });

  it('byPatient key includes patientId', () => {
    expect(MEDICAL_RECORD_KEYS.byPatient('pat-1')).toEqual([
      'medical-records',
      'patient',
      'pat-1',
    ]);
  });
});

// ── useMedicalRecord ──────────────────────────────────────────────────────────

describe('useMedicalRecord', () => {
  it('is disabled when id is empty string', () => {
    const { result } = renderHook(() => useMedicalRecord(''), {
      wrapper: makeWrapper(),
    });
    // enabled:false → fetchStatus idle
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches when id is provided', async () => {
    const { result } = renderHook(() => useMedicalRecord('rec-1'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'rec-1', patientId: 'pat-1' });
  });
});

// ── useMedicalRecordsByPatients ───────────────────────────────────────────────

describe('useMedicalRecordsByPatients', () => {
  it('is disabled when patientIds array is empty', () => {
    const { result } = renderHook(() => useMedicalRecordsByPatients([]), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches when patientIds has entries', async () => {
    const { result } = renderHook(() => useMedicalRecordsByPatients(['pat-1']), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

// ── useCreateMedicalRecord ────────────────────────────────────────────────────

describe('useCreateMedicalRecord', () => {
  it('exposes a mutate function', () => {
    const { result } = renderHook(() => useCreateMedicalRecord(), {
      wrapper: makeWrapper(),
    });
    expect(typeof result.current.mutate).toBe('function');
  });

  it('calls medicalRecordService.create on mutate', async () => {
    const { medicalRecordService } = await import('../../services/MedicalRecord');
    const { result } = renderHook(() => useCreateMedicalRecord(), {
      wrapper: makeWrapper(),
    });

    const input = { patientId: 'pat-1', diagnosis: 'Gripe' } as any;
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(medicalRecordService.create).toHaveBeenCalledWith(input);
  });
});

// ── useDeleteMedicalRecord ────────────────────────────────────────────────────

describe('useDeleteMedicalRecord', () => {
  it('calls medicalRecordService.delete on mutate', async () => {
    const { medicalRecordService } = await import('../../services/MedicalRecord');
    const { result } = renderHook(() => useDeleteMedicalRecord(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('rec-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(medicalRecordService.delete).toHaveBeenCalledWith('rec-1');
  });
});
