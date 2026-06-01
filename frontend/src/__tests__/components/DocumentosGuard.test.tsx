import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DocumentosGuard } from '../../components/ui/DocumentosGuard';

vi.mock('../../context/PermissionsContext', () => ({
  usePermissions: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', roleId: 1, username: 'Admin' },
    token: 'tok',
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}));

import { usePermissions } from '../../context/PermissionsContext';

function renderGuard(canAccess: boolean) {
  vi.mocked(usePermissions).mockReturnValue({
    canAccessFinanceiro: false,
    canAccessUsers: false,
    canAccessNotas: false,
    canAccessRh: false,
    canAccessDocumentos: canAccess,
  });

  render(
    <MemoryRouter initialEntries={['/documentos']}>
      <Routes>
        <Route element={<DocumentosGuard />}>
          <Route path="/documentos" element={<div data-testid="protected-content">Conteúdo Protegido</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('DocumentosGuard', () => {
  it('renders children when canAccessDocumentos is true', () => {
    renderGuard(true);
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('renders AcessoNegado when canAccessDocumentos is false', () => {
    renderGuard(false);
    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
