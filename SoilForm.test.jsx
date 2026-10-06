import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoilForm from './SoilForm.jsx';

describe('SoilForm', () => {
  it('shows errors and does not submit when the form is empty', async () => {
    const onSubmit = vi.fn();
    render(<SoilForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /get crop suggestions/i }));

    expect(screen.getByText(/soil ph between 3 and 10/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits clean values when the form is valid', async () => {
    const onSubmit = vi.fn();
    render(<SoilForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/soil ph/i), '6.5');
    await userEvent.selectOptions(screen.getByLabelText(/nitrogen/i), 'high');
    await userEvent.selectOptions(screen.getByLabelText(/phosphorus/i), 'medium');
    await userEvent.selectOptions(screen.getByLabelText(/potassium/i), 'low');
    await userEvent.click(screen.getByRole('button', { name: /get crop suggestions/i }));

    expect(onSubmit).toHaveBeenCalledWith({ ph: 6.5, nitrogen: 'high', phosphorus: 'medium', potassium: 'low' });
  });
});
