import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAgendaPage } from '../../hooks/useAgendaPage';
import { USER_ROLES } from '../../types/roles';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockUseAppointmentsPaginatedSearch = vi.fn();
const mockUseDoctors = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../../hooks/useAppointments', () => ({
  useAppointmentsPaginatedSearch: (...args: unknown[]) =>
    mockUseAppointmentsPaginatedSearch(...args),
}));

vi.mock('../../hooks/useUsers', () => ({
  useDoctors: () => mockUseDoctors(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// ── Fixtures ─────────────────────────────────────────────────────────────────

const adminUser = { id: 'admin-1', roleId: USER_ROLES.ADMIN };
const doctorUser = { id: 'doc-1', roleId: USER_ROLES.DOCTOR };

const makeAuthResult = (user: typeof adminUser | typeof doctorUser | null) => ({
  user,
  token: user ? 'tok' : null,
  isAuthenticated: !!user,
  logout: vi.fn(),
});

const emptyQuery = { data: undefined, isLoading: false };
const makeQuery = (data: unknown[] = []) => ({
  data: { data, pagination: { total: data.length, totalPages: 1 } },
  isLoading: false,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAppointmentsPaginatedSearch.mockReturnValue(emptyQuery);
  mockUseDoctors.mockReturnValue({ data: [] });
  mockUseAuth.mockReturnValue(makeAuthResult(adminUser));
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useAgendaPage — initial state', () => {
  it('returns empty appointments when no data', () => {
    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));
    expect(result.current.appointments).toEqual([]);
  });

  it('starts with empty search and no selected doctor', () => {
    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));
    expect(result.current.search).toBe('');
    expect(result.current.selectDoctor).toBe('');
  });
});

describe('useAgendaPage — doctor options', () => {
  it('maps users to doctorOptions { value, label }', () => {
    mockUseDoctors.mockReturnValue({
      data: [
        { id: 'd1', username: 'dr.silva' },
        { id: 'd2', username: 'dr.costa' },
      ],
    });

    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));
    expect(result.current.doctorOptions).toEqual([
      { value: 'd1', label: 'dr.silva' },
      { value: 'd2', label: 'dr.costa' },
    ]);
  });

  it('returns empty doctorOptions when users are undefined', () => {
    mockUseDoctors.mockReturnValue({ data: undefined });
    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));
    expect(result.current.doctorOptions).toEqual([]);
  });
});

describe('useAgendaPage — search behaviour', () => {
  it('setSearch updates search and resets page to 1', () => {
    const setPage = vi.fn();
    const { result } = renderHook(() => useAgendaPage(5, setPage, null));

    act(() => {
      result.current.setSearch('Pedro');
    });

    expect(result.current.search).toBe('Pedro');
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it('passes undefined date to query when search is active', () => {
    const { result } = renderHook(() =>
      useAgendaPage(1, vi.fn(), new Date('2026-04-10')),
    );

    act(() => {
      result.current.setSearch('Pedro');
    });

    const [, , , dateArg] = mockUseAppointmentsPaginatedSearch.mock.lastCall!;
    expect(dateArg).toBeUndefined();
  });

  it('passes date string when search is empty', () => {
    // Use local-time constructor to avoid UTC-offset shifting the date
    const date = new Date(2026, 3, 10); // month is 0-indexed: 3 = April
    const { result: _r } = renderHook(() => useAgendaPage(1, vi.fn(), date));

    const [, , , dateArg] = mockUseAppointmentsPaginatedSearch.mock.lastCall!;
    expect(dateArg).toBe('2026-04-10');
  });
});

describe('useAgendaPage — doctor selection', () => {
  it('setSelectDoctor updates selectDoctor and resets page', () => {
    const setPage = vi.fn();
    const { result } = renderHook(() => useAgendaPage(3, setPage, null));

    act(() => {
      result.current.setSelectDoctor('doc-42');
    });

    expect(result.current.selectDoctor).toBe('doc-42');
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it('DOCTOR role always uses own userId regardless of selectDoctor', () => {
    mockUseAuth.mockReturnValue(makeAuthResult(doctorUser));

    renderHook(() => useAgendaPage(1, vi.fn(), null));

    const [, , , , userIdArg] = mockUseAppointmentsPaginatedSearch.mock.lastCall!;
    expect(userIdArg).toBe('doc-1');
  });

  it('ADMIN role uses selectDoctor when set', () => {
    mockUseAuth.mockReturnValue(makeAuthResult(adminUser));
    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));

    act(() => {
      result.current.setSelectDoctor('doc-99');
    });

    const [, , , , userIdArg] = mockUseAppointmentsPaginatedSearch.mock.lastCall!;
    expect(userIdArg).toBe('doc-99');
  });
});

describe('useAgendaPage — pagination', () => {
  it('exposes total and totalPages', () => {
    mockUseAppointmentsPaginatedSearch.mockReturnValue({
      data: { data: [], pagination: { total: 20, totalPages: 2 } },
      isLoading: false,
    });

    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));
    expect(result.current.total).toBe(20);
    expect(result.current.totalPages).toBe(2);
  });

  it('defaults to 0 total and 1 totalPage when data is absent', () => {
    const { result } = renderHook(() => useAgendaPage(1, vi.fn(), null));
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(1);
  });
});
