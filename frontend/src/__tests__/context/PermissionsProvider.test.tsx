import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PermissionsProvider } from '../../context/PermissionsProvider';
import { usePermissions } from '../../context/PermissionsContext';
import { USER_ROLES } from '../../types/roles';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';

function FinanceiroDisplay() {
  const { canAccessFinanceiro } = usePermissions();
  return <div data-testid="result-financeiro">{canAccessFinanceiro ? 'allowed' : 'denied'}</div>;
}

function DocumentosDisplay() {
  const { canAccessDocumentos } = usePermissions();
  return <div data-testid="result-documentos">{canAccessDocumentos ? 'allowed' : 'denied'}</div>;
}

function RhDisplay() {
  const { canAccessRh } = usePermissions();
  return <div data-testid="result-rh">{canAccessRh ? 'allowed' : 'denied'}</div>;
}

function UsersDisplay() {
  const { canAccessUsers } = usePermissions();
  return <div data-testid="result-users">{canAccessUsers ? 'allowed' : 'denied'}</div>;
}

function renderWithRole(roleId: number | null, display: 'financeiro' | 'documentos' | 'rh' | 'users' = 'financeiro') {
  vi.mocked(useAuth).mockReturnValue({
    user: roleId !== null ? ({ id: 'u1', roleId } as ReturnType<typeof useAuth>['user']) : null,
    token: 'tok',
    isAuthenticated: true,
    logout: vi.fn(),
  });

  render(
    <PermissionsProvider>
      {display === 'financeiro' ? <FinanceiroDisplay /> : display === 'rh' ? <RhDisplay /> : display === 'users' ? <UsersDisplay /> : <DocumentosDisplay />}
    </PermissionsProvider>,
  );
}

describe('PermissionsProvider — canAccessFinanceiro', () => {
  it('grants access to ADMIN (roleId=1)', () => {
    renderWithRole(USER_ROLES.ADMIN, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('allowed');
  });

  it('denies access to RECEPTIONIST (roleId=5)', () => {
    renderWithRole(USER_ROLES.RECEPTIONIST, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('denied');
  });

  it('denies access to IT_SUPPORT (roleId=9)', () => {
    renderWithRole(USER_ROLES.IT_SUPPORT, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('denied');
  });

  it('denies access to DOCTOR (roleId=3)', () => {
    renderWithRole(USER_ROLES.DOCTOR, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('denied');
  });

  it('denies access to NURSE (roleId=4)', () => {
    renderWithRole(USER_ROLES.NURSE, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('denied');
  });

  it('denies access to USER (roleId=2)', () => {
    renderWithRole(USER_ROLES.USER, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('denied');
  });

  it('denies access when user is null', () => {
    renderWithRole(null, 'financeiro');
    expect(screen.getByTestId('result-financeiro').textContent).toBe('denied');
  });
});

describe('PermissionsProvider — canAccessRh', () => {
  it('grants access to ADMIN', () => {
    renderWithRole(USER_ROLES.ADMIN, 'rh');
    expect(screen.getByTestId('result-rh').textContent).toBe('allowed');
  });

  it('denies access to IT_SUPPORT', () => {
    renderWithRole(USER_ROLES.IT_SUPPORT, 'rh');
    expect(screen.getByTestId('result-rh').textContent).toBe('denied');
  });
});

describe('PermissionsProvider — canAccessUsers', () => {
  it('grants access to ADMIN', () => {
    renderWithRole(USER_ROLES.ADMIN, 'users');
    expect(screen.getByTestId('result-users').textContent).toBe('allowed');
  });

  it('denies access to IT_SUPPORT', () => {
    renderWithRole(USER_ROLES.IT_SUPPORT, 'users');
    expect(screen.getByTestId('result-users').textContent).toBe('denied');
  });
});

describe('PermissionsProvider — canAccessDocumentos', () => {
  it('grants access to ADMIN (roleId=1)', () => {
    renderWithRole(USER_ROLES.ADMIN, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('allowed');
  });

  it('denies access to USER (roleId=2)', () => {
    renderWithRole(USER_ROLES.USER, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('denied');
  });

  it('denies access to DOCTOR (roleId=3)', () => {
    renderWithRole(USER_ROLES.DOCTOR, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('denied');
  });

  it('denies access to NURSE (roleId=4)', () => {
    renderWithRole(USER_ROLES.NURSE, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('denied');
  });

  it('denies access to RECEPTIONIST (roleId=5)', () => {
    renderWithRole(USER_ROLES.RECEPTIONIST, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('denied');
  });

  it('denies access to IT_SUPPORT (roleId=9)', () => {
    renderWithRole(USER_ROLES.IT_SUPPORT, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('denied');
  });

  it('denies access when user is null', () => {
    renderWithRole(null, 'documentos');
    expect(screen.getByTestId('result-documentos').textContent).toBe('denied');
  });
});
