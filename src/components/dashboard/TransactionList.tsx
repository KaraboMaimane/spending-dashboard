import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Car,
  ChevronDown,
  ChevronUp,
  Film,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { SpendingPeriod, Transaction } from '../../types/spending';
import { formatZAR } from '../../utils/formatCurrency';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  film: Film,
  car: Car,
  utensils: Utensils,
  zap: Zap,
};

const PERIOD_DAYS: Record<SpendingPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

const PERIOD_LABELS: Record<SpendingPeriod, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '1y': 'Last year',
};

const PAGE_SIZE = 8;
const DAY_MS = 24 * 60 * 60 * 1000;
const LEDGER_ANCHOR_MS = Date.parse('2024-09-17T23:59:59Z');

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function filterByPeriod(transactions: Transaction[], period: SpendingPeriod): Transaction[] {
  const cutoff = LEDGER_ANCHOR_MS - PERIOD_DAYS[period] * DAY_MS;
  return transactions.filter((txn) => Date.parse(txn.date) >= cutoff);
}

interface ListFrameProps {
  children?: ReactNode;
  subtitle: string;
  busy?: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function ListFrame({ children, subtitle, busy = false, collapsed, onToggleCollapse }: ListFrameProps) {
  const ToggleIcon = collapsed ? ChevronDown : ChevronUp;
  const toggleLabel = collapsed ? 'Show' : 'Hide';

  return (
    <article
      aria-labelledby="transactions-title"
      aria-busy={busy}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id="transactions-title" className="text-sm font-semibold text-slate-900">
            Recent transactions
          </h2>
          <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls="transactions-scroll-region"
          onClick={onToggleCollapse}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <span>{toggleLabel}</span>
          <ToggleIcon aria-hidden="true" className="size-3.5" />
        </button>
      </div>
      {!collapsed && children}
    </article>
  );
}

function TransactionSkeleton() {
  return (
    <div aria-hidden="true" className="mt-4 space-y-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="skeleton h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const Icon = CATEGORY_ICONS[transaction.icon] ?? Receipt;
  const date = new Date(transaction.date);

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${transaction.categoryColor}1F`, color: transaction.categoryColor }}
      >
        <Icon className="size-[18px]" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{transaction.merchant}</p>
        <p className="truncate text-xs text-slate-500">
          {transaction.category} · <time dateTime={transaction.date}>{dateFormat.format(date)}</time>
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-slate-900 tabular-nums">{formatZAR(-transaction.amount)}</p>
        <p className="text-xs text-slate-500">{transaction.paymentMethod}</p>
      </div>
    </li>
  );
}

interface InfiniteTransactionFeedProps {
  items: Transaction[];
}

function InfiniteTransactionFeed({ items }: InfiniteTransactionFeedProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const loadMore = () => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollContainerRef.current;
    if (!sentinel || !root || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
        }
      },
      { root, rootMargin: '80px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, items.length]);

  return (
    <div id="transactions-scroll-region" className="mt-3">
      <div
        ref={scrollContainerRef}
        className="max-h-80 overflow-y-auto pr-1 sm:max-h-96"
      >
        <ul className="divide-y divide-slate-100">
          {visibleItems.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </ul>
        {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="tabular-nums">
          Showing {visibleItems.length} of {items.length}
        </span>
        {hasMore && (
          <button
            type="button"
            onClick={loadMore}
            className="font-semibold text-slate-900 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  period: SpendingPeriod;
  selectedCategory?: string;
  isLoading: boolean;
  error: string | null;
}

export function TransactionList({
  transactions,
  period,
  selectedCategory,
  isLoading,
  error,
}: TransactionListProps) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed((prev) => !prev);
  const periodTransactions = filterByPeriod(transactions, period);
  const categoryLabel = selectedCategory ?? 'All categories';
  const baseSubtitle = `${categoryLabel} · ${PERIOD_LABELS[period]}`;

  if (isLoading) {
    return (
      <ListFrame subtitle={baseSubtitle} busy collapsed={collapsed} onToggleCollapse={toggleCollapse}>
        <TransactionSkeleton />
      </ListFrame>
    );
  }

  if (error || periodTransactions.length === 0) {
    const emptyCopy = error ? 'Transactions are unavailable right now.' : 'No transactions found for this filter.';
    return (
      <ListFrame subtitle={baseSubtitle} collapsed={collapsed} onToggleCollapse={toggleCollapse}>
        <p className="mt-3 text-sm text-slate-500">{emptyCopy}</p>
      </ListFrame>
    );
  }

  const sorted = [...periodTransactions].sort((a, b) => b.date.localeCompare(a.date));
  const feedKey = `${period}-${selectedCategory ?? 'all'}-${sorted.length}`;

  return (
    <ListFrame
      subtitle={`${baseSubtitle} (${sorted.length})`}
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
    >
      <InfiniteTransactionFeed key={feedKey} items={sorted} />
    </ListFrame>
  );
}
