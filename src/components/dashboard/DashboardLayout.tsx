import type { ReactNode } from 'react';
import type { SpendingPeriod } from '../../types/spending';

type TimeframeOption = { value: SpendingPeriod; short: string; long: string };

const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { value: '7d', short: '7d', long: 'Last 7 days' },
  { value: '30d', short: '30d', long: 'Last 30 days' },
  { value: '90d', short: '90d', long: 'Last 90 days' },
];

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

interface ProfileGreetingProps {
  name?: string;
  isLoading: boolean;
}

function ProfileGreeting({ name, isLoading }: ProfileGreetingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="skeleton size-10 rounded-full" />
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-4 w-28" />
        </div>
      </div>
    );
  }

  const firstName = name?.split(' ')[0];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
      >
        {name ? getInitials(name) : '•'}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">{getGreeting(new Date().getHours())}</p>
        <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
          {firstName ?? 'Welcome back'}
        </h1>
      </div>
    </div>
  );
}

interface TimeframeSelectorProps {
  value: SpendingPeriod;
  onChange: (period: SpendingPeriod) => void;
}

function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <fieldset className="flex shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-1">
      <legend className="sr-only">Spending timeframe</legend>
      {TIMEFRAME_OPTIONS.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="radio"
            name="timeframe"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span
            className="flex min-h-9 min-w-11 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 peer-checked:bg-white peer-checked:text-slate-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-1"
          >
            <span aria-hidden="true">{option.short}</span>
            <span className="sr-only">{option.long}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

interface DashboardLayoutProps {
  userName?: string;
  isLoading: boolean;
  period: SpendingPeriod;
  onPeriodChange: (period: SpendingPeriod) => void;
  primary: ReactNode;
  secondary?: ReactNode;
}

export function DashboardLayout({
  userName,
  isLoading,
  period,
  onPeriodChange,
  primary,
  secondary,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-svh bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <ProfileGreeting name={userName} isLoading={isLoading} />
          <TimeframeSelector value={period} onChange={onPeriodChange} />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-5 sm:px-6 md:grid-cols-12 md:items-start md:gap-6 md:py-8">
        <section aria-label="Spending overview" className="flex flex-col gap-3 md:col-span-7">
          {primary}
        </section>
        {secondary && (
          <section aria-label="Spending insights" className="flex flex-col gap-4 md:col-span-5">
            {secondary}
          </section>
        )}
      </main>
    </div>
  );
}
