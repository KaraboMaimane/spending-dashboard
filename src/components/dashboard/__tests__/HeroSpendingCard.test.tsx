import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ISpendingCategory, ISpendingSummary } from '../../../types/spending';
import { HeroSpendingCard } from '../HeroSpendingCard';

const mockSummary: ISpendingSummary = {
  period: '30d',
  totalSpent: 4250.75,
  transactionCount: 53,
  topCategory: 'Groceries',
  comparedToPrevious: {
    spentChange: 12.5,
    transactionChange: -3.2,
  },
};

const mockCategory: ISpendingCategory = {
  name: 'Groceries',
  amount: 1250.3,
  percentage: 29.4,
  transactionCount: 15,
  color: '#FF6B6B',
  icon: 'shopping-cart',
};

describe('HeroSpendingCard', () => {
  it('renders loading skeleton state when isLoading is true', () => {
    render(
      <HeroSpendingCard
        summary={null}
        period="30d"
        isLoading={true}
        error={null}
        onRetry={vi.fn()}
      />
    );

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading total outflow')).toBeInTheDocument();
  });

  it('renders error alert and calls onRetry when clicking Try again', () => {
    const onRetry = vi.fn();
    render(
      <HeroSpendingCard
        summary={null}
        period="30d"
        isLoading={false}
        error="Network failure"
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Network failure')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders populated ZAR summary, delta indicator, and period metrics', () => {
    render(
      <HeroSpendingCard
        summary={mockSummary}
        period="30d"
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('R 4,250.75')).toBeInTheDocument();
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText('53')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('displays active category metrics and triggers onClearCategory', () => {
    const onClearCategory = vi.fn();
    render(
      <HeroSpendingCard
        summary={mockSummary}
        period="30d"
        activeCategory={mockCategory}
        onClearCategory={onClearCategory}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('R 1,250.30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('29.4%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear filter/i }));
    expect(onClearCategory).toHaveBeenCalledTimes(1);
  });
});
