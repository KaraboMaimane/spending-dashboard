import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Transaction } from '../../../types/spending';
import { TransactionList } from '../TransactionList';

const sampleTransactions: Transaction[] = Array.from({ length: 10 }, (_, idx) => ({
  id: `txn_${idx + 1}`,
  date: idx < 9 ? '2024-09-16T10:00:00Z' : '2024-08-25T10:00:00Z',
  merchant: `Merchant ${idx + 1}`,
  category: 'Groceries',
  amount: 100 + idx,
  description: 'Test purchase',
  paymentMethod: 'Credit Card',
  icon: 'shopping-cart',
  categoryColor: '#FF6B6B',
}));

describe('TransactionList', () => {
  it('filters transactions by period and supports incremental loading and collapsing', () => {
    render(
      <TransactionList
        transactions={sampleTransactions}
        period="7d"
        selectedCategory="Groceries"
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText('Groceries · Last 7 days (9)')).toBeInTheDocument();
    expect(screen.getByText('Showing 8 of 9')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(screen.getByText('Showing 9 of 9')).toBeInTheDocument();

    const hideBtn = screen.getByRole('button', { name: /hide/i });
    fireEvent.click(hideBtn);
    expect(screen.queryByText('Showing 9 of 9')).not.toBeInTheDocument();

    const showBtn = screen.getByRole('button', { name: /show/i });
    fireEvent.click(showBtn);
    expect(screen.getByText('Showing 8 of 9')).toBeInTheDocument();
  });
});
