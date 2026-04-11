import { describe, it, expect } from 'vitest';
import { renderHook, act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';

const testSchema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
});

// ── API shape ─────────────────────────────────────────────────────────────────

describe('useZodForm — API shape', () => {
  it('returns register, handleSubmit and formState', () => {
    const { result } = renderHook(() => useZodForm(testSchema));
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(result.current.formState).toBeDefined();
  });

  it('starts with no errors', () => {
    const { result } = renderHook(() => useZodForm(testSchema));
    expect(result.current.formState.errors).toEqual({});
  });

  it('applies defaultValues via getValues', () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, {
        defaultValues: { email: 'pre@filled.com', name: 'Dr. Silva' },
      }),
    );
    expect(result.current.getValues('email')).toBe('pre@filled.com');
    expect(result.current.getValues('name')).toBe('Dr. Silva');
  });

  it('reset() restores defaultValues', async () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, {
        defaultValues: { email: 'pre@filled.com', name: 'Dr. Silva' },
      }),
    );

    await act(async () => {
      result.current.setValue('email', 'changed@test.com');
      result.current.reset();
    });

    expect(result.current.getValues('email')).toBe('pre@filled.com');
  });
});

// ── Validation via rendered form ──────────────────────────────────────────────

function TestForm({ onSubmit = () => {} }: { onSubmit?: (d: unknown) => void }) {
  const { register, handleSubmit, formState: { errors } } = useZodForm(testSchema);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="form">
      <input data-testid="email" {...register('email')} />
      {errors.email && <p data-testid="email-error">{errors.email.message}</p>}
      <input data-testid="name" {...register('name')} />
      {errors.name && <p data-testid="name-error">{errors.name.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

describe('useZodForm — validation in a rendered form', () => {
  it('shows required error when submitting empty email', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('email-error').textContent).toBe('E-mail obrigatório');
    });
  });

  it('shows invalid email error after typing a bad email', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.type(screen.getByTestId('email'), 'notanemail');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('email-error').textContent).toBe('E-mail inválido');
    });
  });

  it('shows name min-length error', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.type(screen.getByTestId('name'), 'A');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('name-error').textContent).toBe('Mínimo 2 caracteres');
    });
  });

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('email'), 'valid@email.com');
    await user.type(screen.getByTestId('name'), 'Dr. Silva');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { email: 'valid@email.com', name: 'Dr. Silva' },
        expect.anything(),
      );
    });
  });
});
