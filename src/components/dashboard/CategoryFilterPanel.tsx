import { X } from 'lucide-react';
import type { ISpendingCategory } from '../../types/spending';

interface FilterChipProps {
  label: string;
  pressed: boolean;
  onClick: () => void;
  color?: string;
}

function FilterChip({ label, pressed, onClick, color }: FilterChipProps) {
  const tone = pressed
    ? 'border-slate-900 bg-slate-900 text-white'
    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100';

  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${tone}`}
    >
      {color && <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: color }} />}
      {label}
    </button>
  );
}

interface CategoryFilterPanelProps {
  id: string;
  categories: ISpendingCategory[];
  selectedCategory?: string;
  onSelect: (category: string | undefined) => void;
  onClose: () => void;
}

export function CategoryFilterPanel({ id, categories, selectedCategory, onSelect, onClose }: CategoryFilterPanelProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 id={`${id}-title`} className="text-sm font-semibold text-slate-900">
          Filter transactions by category
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip label="All" pressed={!selectedCategory} onClick={() => onSelect(undefined)} />
        {categories.map((category) => (
          <FilterChip
            key={category.name}
            label={category.name}
            color={category.color}
            pressed={selectedCategory === category.name}
            onClick={() => onSelect(category.name)}
          />
        ))}
      </div>
    </section>
  );
}
