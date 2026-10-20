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
    ? 'border-capitec-blue bg-capitec-blue text-white shadow-xs'
    : 'border-slate-200 bg-white text-capitec-navy hover:border-capitec-cyan/50 hover:bg-capitec-sky/60';

  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-capitec-cyan ${tone}`}
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
      className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 id={`${id}-title`} className="text-sm font-semibold text-capitec-navy">
          Filter transactions by category
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-capitec-sky hover:text-capitec-blue focus-visible:outline-2 focus-visible:outline-capitec-cyan"
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
