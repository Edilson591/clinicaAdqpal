import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PermissionsProvider } from '../../context/PermissionsProvider';
import { usePermissions } from '../../context/PermissionsContext';
import { USER_ROLES } from '../../types/roles';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';

function PermissionDisplay() {
  const { canAccessFinanceiro } = usePermissions();
  return <div data-testid="result">{canAccessFinanceiro ? 'allowed' : 'denied'}</div>;
}

function renderWithRole(roleId: number | null) {
  vi.mocked(useAuth).mockReturnValue({
    user: roleId !== null ? ({ id: 'u1', roleId } as any) : null,
    token: 'tok',
    isAuthenticated: true,
    logout: vi.fn(),
  });

  render(
    <PermissionsProvider>
      <PermissionDisplay />
    </PermissionsProvider>,
  );
}

describe('PermissionsProvider — canAccessFinanceiro', () => {
  it('grants access to ADMIN (roleId=1)', () => {
    renderWithRole(USER_ROLES.ADMIN);
    expect(screen.getByTestId('result').textContent).toBe('allowed');
  });

  it('grants access to RECEPTIONIST (roleId=5)', () => {
    renderWithRole(USER_ROLES.RECEPTIONIST);
    expect(screen.getByTestId('result').textContent).toBe('allowed');
  });

  it('grants access to IT_SUPPORT (roleId=9)', () => {
    renderWithRole(USER_ROLES.IT_SUPPORT);
    expect(screen.getByTestId('result').textContent).toBe('allowed');
  });

  it('denies access to DOCTOR (roleId=3)', () => {
    renderWithRole(USER_ROLES.DOCTOR);
    expect(screen.getByTestId('result').textContent).toBe('denied');
  });

  it('denies access to NURSE (roleId=4)', () => {
    renderWithRole(USER_ROLES.NURSE);
    expect(screen.getByTestId('result').textContent).toBe('denied');
  });

  it('denies access to USER (roleId=2)', () => {
    renderWithRole(USER_ROLES.USER);
    expect(screen.getByTestId('result').textContent).toBe('denied');
  });

  it('denies access when user is null', () => {
    renderWithRole(null);
    expect(screen.getByTestId('result').textContent).toBe('denied');
  });
});
