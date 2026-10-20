import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
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
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="category-distribution-title" className="text-sm font-semibold text-capitec-navy">
          Where your money went
        </h2>
        {selectedCategory && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-capitec-cyan hover:text-capitec-blue focus-visible:outline-2 focus-visible:outline-capitec-cyan"
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
      <div className="skeleton mx-auto size-36 rounded-full" />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function getSliceOpacity(categoryName: string, selectedCategory?: string): number {
  if (!selectedCategory || selectedCategory === categoryName) {
    return 1;
  }
  return 0.3;
}

interface CategoryDonutChartProps {
  categories: ISpendingCategory[];
  selectedCategory?: string;
  onSelect: (name: string) => void;
}

function CategoryDonutChart({ categories, selectedCategory, onSelect }: CategoryDonutChartProps) {
  return (
    <div className="mt-3 h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categories}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={2}
            onClick={(entry) => {
              if (entry.name) onSelect(entry.name);
            }}
            className="cursor-pointer outline-none"
          >
            {categories.map((category) => (
              <Cell
                key={category.name}
                fill={category.color}
                fillOpacity={getSliceOpacity(category.name, selectedCategory)}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatZAR(Number(value))}
            contentStyle={{
              borderRadius: '0.75rem',
              borderColor: '#e2e8f0',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#002b49',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
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
    ? 'bg-capitec-blue text-white shadow-xs'
    : 'text-capitec-navy hover:bg-capitec-sky/60';

  return (
    <li>
      <button
        type="button"
        aria-pressed={highlighted}
        onClick={() => onSelect(category.name)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-capitec-cyan ${highlight}`}
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
          <span className={`text-sm font-semibold ${highlighted ? 'text-white' : 'text-capitec-navy'}`}>
            {formatZAR(category.amount)}
          </span>
          <span className={`w-12 text-right text-xs ${highlighted ? 'text-sky-200' : 'text-slate-500'}`}>
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
      <CategoryDonutChart
        categories={sorted}
        selectedCategory={selectedCategory}
        onSelect={handleToggle}
      />
      <ul className="mt-2 -mx-1 space-y-1">
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
