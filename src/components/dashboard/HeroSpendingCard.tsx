import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, CircleAlert, Minus, X, type LucideIcon } from 'lucide-react';
import type { ISpendingCategory, ISpendingSummary, SpendingPeriod } from '../../types/spending';
import { formatPercent, formatZAR } from '../../utils/formatCurrency';

const PERIOD_LABELS: Record<SpendingPeriod, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
  '1y': 'year',
};

const ALERT_THRESHOLD = 10;

type DeltaTone = 'decrease' | 'flat' | 'caution' | 'alert';

interface DeltaStyle {
  Icon: LucideIcon;
  verb: string;
  className: string;
}

const DELTA_STYLES: Record<DeltaTone, DeltaStyle> = {
  decrease: { Icon: ArrowDownRight, verb: 'Down', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  flat: { Icon: Minus, verb: 'No change', className: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
  caution: { Icon: ArrowUpRight, verb: 'Up', className: 'bg-amber-50 text-amber-800 ring-amber-600/25' },
  alert: { Icon: ArrowUpRight, verb: 'Up', className: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
};

function getDeltaTone(change: number): DeltaTone {
  if (change < 0) return 'decrease';
  if (change === 0) return 'flat';
  return change > ALERT_THRESHOLD ? 'alert' : 'caution';
}

interface DeltaBadgeProps {
  change: number;
  periodLabel: string;
}

function DeltaBadge({ change, periodLabel }: DeltaBadgeProps) {
  const { Icon, verb, className } = DELTA_STYLES[getDeltaTone(change)];
  const value = formatPercent(change);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset sm:text-sm ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2.5} />
      <span className="sr-only">{`${verb} ${value} compared to the previous ${periodLabel}`}</span>
      <span aria-hidden="true">{value}</span>
    </span>
  );
}

function CardShell({ children, busy = false }: { children: ReactNode; busy?: boolean }) {
  return (
    <article
      aria-labelledby="hero-spend-label"
      aria-busy={busy}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {children}
    </article>
  );
}

function HeroCardSkeleton() {
  return (
    <CardShell busy>
      <p id="hero-spend-label" className="sr-only">
        Loading total outflow
      </p>
      <div aria-hidden="true" className="space-y-4">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-10 w-56 sm:h-12 sm:w-64" />
        <div className="skeleton h-6 w-40 rounded-full" />
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="skeleton h-9" />
          <div className="skeleton h-9" />
        </div>
      </div>
    </CardShell>
  );
}

interface HeroCardErrorProps {
  message: string;
  onRetry: () => void;
}

function HeroCardError({ message, onRetry }: HeroCardErrorProps) {
  return (
    <CardShell>
      <div role="alert" className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2 text-rose-700">
          <CircleAlert aria-hidden="true" className="size-5" />
          <h2 id="hero-spend-label" className="text-base font-semibold">
            We couldn't load your spending
          </h2>
        </div>
        <p className="text-sm text-slate-600">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          Try again
        </button>
      </div>
    </CardShell>
  );
}

interface HeroDisplayMetrics {
  heading: string;
  amount: number;
  subtext: string;
  transactionCount: number;
  secondaryLabel: string;
  secondaryValue: string;
}

function buildDisplayMetrics(
  summary: ISpendingSummary,
  periodLabel: string,
  activeCategory?: ISpendingCategory
): HeroDisplayMetrics {
  if (activeCategory) {
    return {
      heading: activeCategory.name,
      amount: activeCategory.amount,
      subtext: `${activeCategory.percentage.toFixed(1)}% of ${formatZAR(summary.totalSpent)} period spend`,
      transactionCount: activeCategory.transactionCount,
      secondaryLabel: 'Share of spend',
      secondaryValue: `${activeCategory.percentage.toFixed(1)}%`,
    };
  }

  return {
    heading: 'Total outflow',
    amount: summary.totalSpent,
    subtext: `vs previous ${periodLabel}`,
    transactionCount: summary.transactionCount,
    secondaryLabel: 'Top category',
    secondaryValue: summary.topCategory,
  };
}

interface HeroCardContentProps {
  summary: ISpendingSummary;
  period: SpendingPeriod;
  activeCategory?: ISpendingCategory;
  onClearCategory?: () => void;
}

function HeroCardContent({ summary, period, activeCategory, onClearCategory }: HeroCardContentProps) {
  const periodLabel = PERIOD_LABELS[period];
  const metrics = buildDisplayMetrics(summary, periodLabel, activeCategory);

  return (
    <CardShell>
      <div className="flex items-center justify-between gap-2">
        <h2 id="hero-spend-label" className="flex items-center gap-2 text-sm font-medium text-slate-500">
          {activeCategory && (
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: activeCategory.color }}
            />
          )}
          <span>
            {metrics.heading} <span className="text-slate-400">· last {periodLabel}</span>
          </span>
        </h2>
        {activeCategory && onClearCategory && (
          <button
            type="button"
            onClick={onClearCategory}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span>Clear filter</span>
            <X aria-hidden="true" className="size-3.5" />
          </button>
        )}
      </div>

      <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 tabular-nums sm:text-5xl">
        {formatZAR(metrics.amount)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DeltaBadge change={summary.comparedToPrevious.spentChange} periodLabel={periodLabel} />
        <span aria-hidden="true" className="text-xs text-slate-500 sm:text-sm">
          {metrics.subtext}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div>
          <dt className="text-xs font-medium text-slate-500">Transactions</dt>
          <dd className="mt-0.5 text-base font-semibold text-slate-900 tabular-nums">{metrics.transactionCount}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">{metrics.secondaryLabel}</dt>
          <dd className="mt-0.5 truncate text-base font-semibold text-slate-900">{metrics.secondaryValue}</dd>
        </div>
      </dl>
    </CardShell>
  );
}

interface HeroSpendingCardProps {
  summary: ISpendingSummary | null;
  period: SpendingPeriod;
  activeCategory?: ISpendingCategory;
  onClearCategory?: () => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function HeroSpendingCard({
  summary,
  period,
  activeCategory,
  onClearCategory,
  isLoading,
  error,
  onRetry,
}: HeroSpendingCardProps) {
  if (isLoading) return <HeroCardSkeleton />;
  if (error || !summary) {
    return <HeroCardError message={error ?? 'Spending summary is unavailable right now.'} onRetry={onRetry} />;
  }
  return (
    <HeroCardContent
      summary={summary}
      period={period}
      activeCategory={activeCategory}
      onClearCategory={onClearCategory}
    />
  );
}
