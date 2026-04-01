import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppointmentSSE } from '../../hooks/useAppointmentSSE';

const mockInvalidateQueries = vi.fn();

vi.mock('../../store/authSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/authSlice')>();
  return {
    ...actual,
    getCookie: vi.fn().mockReturnValue('mock-token'),
  };
});

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
}));

class MockEventSource {
  static instances: MockEventSource[] = [];
  listeners: Record<string, (() => void)[]> = {};
  closed = false;
  onerror: unknown = null;

  constructor(public url: string) {
    MockEventSource.instances.push(this);
  }

  addEventListener(event: string, cb: () => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }

  close() {
    this.closed = true;
  }

  emit(event: string) {
    this.listeners[event]?.forEach((cb) => cb());
  }
}

beforeEach(() => {
  MockEventSource.instances = [];
  mockInvalidateQueries.mockClear();
  vi.stubGlobal('EventSource', MockEventSource);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useAppointmentSSE', () => {
  it('creates an EventSource with the token in the URL', () => {
    renderHook(() => useAppointmentSSE());
    expect(MockEventSource.instances).toHaveLength(1);
    expect(MockEventSource.instances[0].url).toContain('mock-token');
  });

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() => useAppointmentSSE());
    unmount();
    expect(MockEventSource.instances[0].closed).toBe(true);
  });

  it('calls invalidateQueries on appointment_created event', () => {
    renderHook(() => useAppointmentSSE());
    MockEventSource.instances[0].emit('appointment_created');
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
  });

  it('calls invalidateQueries on appointment_updated event', () => {
    renderHook(() => useAppointmentSSE());
    MockEventSource.instances[0].emit('appointment_updated');
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
  });

  it('calls invalidateQueries on appointment_deleted event', () => {
    renderHook(() => useAppointmentSSE());
    MockEventSource.instances[0].emit('appointment_deleted');
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
  });

  it('does nothing when no token is available', async () => {
    const { getCookie } = await import('../../store/authSlice');
    vi.mocked(getCookie).mockReturnValueOnce(null);
    renderHook(() => useAppointmentSSE());
    expect(MockEventSource.instances).toHaveLength(0);
  });
});
