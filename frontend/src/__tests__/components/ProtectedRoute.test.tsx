import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import ProtectedRoute from '../../components/ui/ProtectedRoute';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../context/ThemeContext', () => ({
  useTheme: vi.fn(() => ({ disabledTheme: vi.fn(), isDark: false, toggleTheme: vi.fn(), colors: {} })),
}));

vi.mock('../../services/User', () => ({
  userService: {
    getById: vi.fn().mockResolvedValue({ id: 'user-1' }),
  },
}));

import { useAuth } from '../../context/AuthContext';
import type { UserResponse } from '../../types/api';

interface User {
  id: string;
}


interface MockUseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null | undefined;
  logout: () => void;
}
function renderRoute(isAuthenticated: boolean, user: { id: string } | null = null) {
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated,
    user: (user as UserResponse ) || null,
    token: isAuthenticated ? 'token' : null,
    logout: vi.fn(),
  } satisfies MockUseAuthReturn);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderRoute(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content when authenticated and token is valid', async () => {
    renderRoute(true, { id: 'user-1' });
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });
});
