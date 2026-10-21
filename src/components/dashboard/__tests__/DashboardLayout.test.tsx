import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardLayout } from '../DashboardLayout';

describe('DashboardLayout', () => {
  it('renders profile greeting, initials, and switches timeframe periods', () => {
    const onPeriodChange = vi.fn();

    render(
      <DashboardLayout
        userName="John Doe"
        isLoading={false}
        period="30d"
        onPeriodChange={onPeriodChange}
        primary={<div>Primary content</div>}
        secondary={<div>Secondary content</div>}
      />
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'John' })).toBeInTheDocument();
    expect(screen.getByText('Primary content')).toBeInTheDocument();
    expect(screen.getByText('Secondary content')).toBeInTheDocument();

    const radio7d = screen.getByRole('radio', { name: /last 7 days/i });
    const radio30d = screen.getByRole('radio', { name: /last 30 days/i });
    expect(radio30d).toBeChecked();

    fireEvent.click(radio7d);
    expect(onPeriodChange).toHaveBeenCalledWith('7d');
  });
});
