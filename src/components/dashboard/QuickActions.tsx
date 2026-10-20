import type { ButtonHTMLAttributes } from 'react';
import { RefreshCw, SlidersHorizontal, type LucideIcon } from 'lucide-react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  iconClassName?: string;
}

function ActionButton({
  icon: Icon,
  label,
  active = false,
  iconClassName = '',
  className = '',
  ...rest
}: ActionButtonProps) {
  const tone = active
    ? 'border-capitec-blue bg-capitec-blue text-white hover:bg-capitec-navy'
    : 'border-slate-200/90 bg-white text-capitec-navy hover:border-capitec-cyan/50 hover:bg-capitec-sky/60';
  const iconTone = active ? 'text-white' : 'text-capitec-cyan';

  return (
    <button
      type="button"
      className={`group flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-capitec-cyan ${tone} ${className}`}
      {...rest}
    >
      <Icon aria-hidden="true" className={`size-4 shrink-0 ${iconTone} ${iconClassName}`} strokeWidth={2.25} />
      <span>{label}</span>
    </button>
  );
}

function getFilterCopy(activeFilter?: string) {
  if (!activeFilter) {
    return { label: 'Filter', ariaLabel: 'Filters' };
  }
  return {
    label: `Filter · ${activeFilter}`,
    ariaLabel: `Filters, ${activeFilter} applied`,
  };
}

interface QuickActionsProps {
  onRefresh: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
  filtersPanelId: string;
  activeFilter?: string;
  isRefreshing?: boolean;
  disabled?: boolean;
}

export function QuickActions({
  onRefresh,
  onToggleFilters,
  filtersOpen,
  filtersPanelId,
  activeFilter,
  isRefreshing = false,
  disabled = false,
}: QuickActionsProps) {
  const filterCopy = getFilterCopy(activeFilter);

  return (
    <div role="group" aria-label="Quick actions" className="flex gap-3">
      <ActionButton
        icon={RefreshCw}
        label={isRefreshing ? 'Refreshing…' : 'Refresh'}
        aria-label="Refresh spending data"
        iconClassName={isRefreshing ? 'animate-spin' : ''}
        onClick={onRefresh}
        disabled={disabled || isRefreshing}
      />
      <ActionButton
        icon={SlidersHorizontal}
        label={filterCopy.label}
        aria-label={filterCopy.ariaLabel}
        aria-expanded={filtersOpen}
        aria-controls={filtersPanelId}
        active={filtersOpen || Boolean(activeFilter)}
        onClick={onToggleFilters}
        disabled={disabled}
      />
    </div>
  );
}
