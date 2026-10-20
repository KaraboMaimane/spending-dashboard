import type { ReactNode } from 'react';
import type { ISpendingCategory } from '../../types/spending';
import { formatZAR } from '../../utils/formatCurrency';

interface CardFrameProps {
  children: ReactNode;
  busy?: boolean;
  selectedCategory?: string;
  onClear?: () => void;
}

function CardFrame({ children, busy = false, selectedCategory, onClear }: CardFrameProps) {
  return (
    <article
      aria-labelledby="category-distribution-title"
      aria-busy={busy}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="category-distribution-title" className="text-sm font-semibold text-slate-900">
          Where your money went
        </h2>
        {selectedCategory && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            Show all
          </button>
        )}
      </div>
      {children}
    </article>
  );
}

function DistributionSkeleton() {
  return (
    <div aria-hidden="true" className="mt-4 space-y-4">
      <div className="skeleton h-3 w-full rounded-full" />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function DistributionBar({
  categories,
  selectedCategory,
}: {
  categories: ISpendingCategory[];
  selectedCategory?: string;
}) {
  return (
    <div aria-hidden="true" className="mt-4 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100">
      {categories.map((category) => {
        const dimmed = Boolean(selectedCategory && selectedCategory !== category.name);
        return (
          <span
            key={category.name}
            className={`h-full transition-opacity first:rounded-l-full last:rounded-r-full ${dimmed ? 'opacity-30' : 'opacity-100'}`}
            style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
          />
        );
      })}
    </div>
  );
}

interface CategoryRowProps {
  category: ISpendingCategory;
  highlighted: boolean;
  onSelect: (category: string) => void;
}

function CategoryRow({ category, highlighted, onSelect }: CategoryRowProps) {
  const highlight = highlighted
    ? 'bg-slate-900 text-white shadow-xs'
    : 'text-slate-700 hover:bg-slate-50';

  return (
    <li>
      <button
        type="button"
        aria-pressed={highlighted}
        onClick={() => onSelect(category.name)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500 ${highlight}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span className="truncate text-sm font-medium">{category.name}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
          <span className={`text-sm font-semibold ${highlighted ? 'text-white' : 'text-slate-900'}`}>
            {formatZAR(category.amount)}
          </span>
          <span className={`w-12 text-right text-xs ${highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
            {category.percentage.toFixed(1)}%
          </span>
        </span>
      </button>
    </li>
  );
}

interface CategoryDistributionProps {
  categories: ISpendingCategory[];
  selectedCategory?: string;
  onSelectCategory?: (category: string | undefined) => void;
  isLoading: boolean;
}

export function CategoryDistribution({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}: CategoryDistributionProps) {
  if (isLoading) {
    return (
      <CardFrame busy>
        <DistributionSkeleton />
      </CardFrame>
    );
  }

  if (categories.length === 0) {
    return (
      <CardFrame>
        <p className="mt-3 text-sm text-slate-500">No category data available for this period.</p>
      </CardFrame>
    );
  }

  const sorted = [...categories].sort((a, b) => b.amount - a.amount);
  const handleToggle = (name: string) => {
    onSelectCategory?.(selectedCategory === name ? undefined : name);
  };

  return (
    <CardFrame selectedCategory={selectedCategory} onClear={() => onSelectCategory?.(undefined)}>
      <DistributionBar categories={sorted} selectedCategory={selectedCategory} />
      <ul className="mt-4 -mx-1 space-y-1">
        {sorted.map((category) => (
          <CategoryRow
            key={category.name}
            category={category}
            highlighted={category.name === selectedCategory}
            onSelect={handleToggle}
          />
        ))}
      </ul>
    </CardFrame>
  );
}
