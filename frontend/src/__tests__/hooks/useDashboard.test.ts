import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from '../../hooks/useDashboard';
import { USER_ROLES } from '../../types/roles';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockUseAppointmentsPaginatedSearch = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../../hooks/useAppointments', () => ({
  useAppointmentsPaginatedSearch: (...args: unknown[]) =>
    mockUseAppointmentsPaginatedSearch(...args),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../utils/formatTime', () => ({
  formatTime: (t: string) => t.slice(0, 5),
}));

// ── Fixtures ─────────────────────────────────────────────────────────────────

const adminUser = { id: 'user-1', roleId: USER_ROLES.ADMIN };
const doctorUser = { id: 'user-2', roleId: USER_ROLES.DOCTOR };
const nurseUser = { id: 'user-3', roleId: USER_ROLES.NURSE };

const makeAuthResult = (user: typeof adminUser | null) => ({
  user,
  token: user ? 'tok' : null,
  isAuthenticated: !!user,
  logout: vi.fn(),
});

const makeAppointment = (overrides = {}) => ({
  id: 'appt-1',
  scheduledAt: '09:00',
  patientId: 'pat-1',
  medicalRecordId: null,
  status: 'SCHEDULED',
  pacient: { name: 'Maria Silva' },
  ...overrides,
});

const makeQueryResult = (appointments: unknown[] = [], total = 0) => ({
  data: {
    data: appointments,
    pagination: { total, totalPages: 1 },
  },
  isLoading: false,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAppointmentsPaginatedSearch.mockReturnValue(makeQueryResult());
  mockUseAuth.mockReturnValue(makeAuthResult(adminUser));
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useDashboard — agendaDoDia mapping', () => {
  it('maps appointments for ADMIN user', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue(
      makeQueryResult([makeAppointment()]),
    );

    const setPage = vi.fn();
    const { result } = renderHook(() => useDashboard(1, setPage, '2026-04-10'));

    expect(result.current.agendaDoDia).toHaveLength(1);
    expect(result.current.agendaDoDia[0].paciente).toBe('Maria Silva');
    expect(result.current.agendaDoDia[0].status).toBe('Confirmada');
    expect(result.current.agendaDoDia[0].horario).toBe('09:00');
  });

  it('maps appointments for DOCTOR user', () => {
    mockUseAuth.mockReturnValue(makeAuthResult(doctorUser));
    mockUseAppointmentsPaginatedSearch.mockReturnValue(
      makeQueryResult([makeAppointment()]),
    );

    const { result } = renderHook(() => useDashboard(1, vi.fn(), '2026-04-10'));
    expect(result.current.agendaDoDia).toHaveLength(1);
  });

  it('returns empty agenda for NURSE (no access)', () => {
    mockUseAuth.mockReturnValue(makeAuthResult(nurseUser));
    mockUseAppointmentsPaginatedSearch.mockReturnValue(
      makeQueryResult([makeAppointment()]),
    );

    const { result } = renderHook(() => useDashboard(1, vi.fn(), '2026-04-10'));
    expect(result.current.agendaDoDia).toHaveLength(0);
  });

  it('returns empty agenda when appointments list is undefined', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useDashboard(1, vi.fn(), '2026-04-10'));
    expect(result.current.agendaDoDia).toHaveLength(0);
  });
});

describe('useDashboard — statusMap', () => {
  const statusCases: Array<[string, string]> = [
    ['SCHEDULED', 'Confirmada'],
    ['CONFIRMED', 'Confirmada'],
    ['COMPLETED', 'Concluido'],
    ['CANCELLED', 'Cancelado'],
    ['CANCELED', 'Cancelado'],
    ['NO_SHOW', 'Cancelado'],
    ['IN_PROGRESS', 'Em Andamento'],
  ];

  statusCases.forEach(([apiStatus, displayStatus]) => {
    it(`maps ${apiStatus} → ${displayStatus}`, () => {
      mockUseAppointmentsPaginatedSearch.mockReturnValue(
        makeQueryResult([makeAppointment({ status: apiStatus })]),
      );

      const { result } = renderHook(() => useDashboard(1, vi.fn(), null));
      expect(result.current.agendaDoDia[0].status).toBe(displayStatus);
    });
  });
});

describe('useDashboard — proximoAtendimento', () => {
  it('returns the first Confirmada appointment', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue(
      makeQueryResult([
        makeAppointment({ id: 'a1', status: 'COMPLETED' }),
        makeAppointment({ id: 'a2', status: 'SCHEDULED' }),
      ]),
    );

    const { result } = renderHook(() => useDashboard(1, vi.fn(), null));
    expect(result.current.proximoAtendimento?.id).toBe('a2');
  });

  it('returns null when no Confirmada appointment exists', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue(
      makeQueryResult([makeAppointment({ status: 'COMPLETED' })]),
    );

    const { result } = renderHook(() => useDashboard(1, vi.fn(), null));
    expect(result.current.proximoAtendimento).toBeNull();
  });
});

describe('useDashboard — search', () => {
  it('setSearch updates search and resets page to 1', () => {
    const setPage = vi.fn();
    const { result } = renderHook(() => useDashboard(3, setPage, null));

    act(() => {
      result.current.setSearch('João');
    });

    expect(result.current.search).toBe('João');
    expect(setPage).toHaveBeenCalledWith(1);
  });
});

describe('useDashboard — pagination', () => {
  it('exposes total and totalPages from query', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue({
      data: { data: [], pagination: { total: 42, totalPages: 3 } },
      isLoading: false,
    });

    const { result } = renderHook(() => useDashboard(1, vi.fn(), null));
    expect(result.current.total).toBe(42);
    expect(result.current.totalPages).toBe(3);
  });

  it('defaults to 0 total and 1 totalPages when data is undefined', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useDashboard(1, vi.fn(), null));
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(1);
  });
});
