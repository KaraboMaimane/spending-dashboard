import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QuickActions } from '../QuickActions';

describe('QuickActions', () => {
  it('invokes onRefresh and onToggleFilters when buttons are clicked', () => {
    const onRefresh = vi.fn();
    const onToggleFilters = vi.fn();

    render(
      <QuickActions
        onRefresh={onRefresh}
        onToggleFilters={onToggleFilters}
        filtersOpen={false}
        filtersPanelId="filter-panel"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Refresh spending data' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);

    const filterBtn = screen.getByRole('button', { name: 'Filters' });
    expect(filterBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(filterBtn);
    expect(onToggleFilters).toHaveBeenCalledTimes(1);
  });

  it('shows active filter badge and refreshing state', () => {
    render(
      <QuickActions
        onRefresh={vi.fn()}
        onToggleFilters={vi.fn()}
        filtersOpen={true}
        filtersPanelId="filter-panel"
        activeFilter="Dining"
        isRefreshing={true}
      />
    );

    const refreshBtn = screen.getByRole('button', { name: 'Refresh spending data' });
    expect(refreshBtn).toBeDisabled();
    expect(screen.getByText('Refreshing…')).toBeInTheDocument();

    const filterBtn = screen.getByRole('button', { name: 'Filters, Dining applied' });
    expect(filterBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Filter · Dining')).toBeInTheDocument();
  });
});
