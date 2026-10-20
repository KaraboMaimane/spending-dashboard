import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ISpendingTrend } from '../../types/spending';
import { formatZAR } from '../../utils/formatCurrency';

const monthFormat = new Intl.DateTimeFormat('en-ZA', { month: 'short' });

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;
  return monthFormat.format(new Date(year, month - 1, 1));
}

function formatAxisRand(value: number): string {
  if (value >= 1000) {
    return `R ${(value / 1000).toFixed(1)}k`;
  }
  return `R ${value}`;
}

function getAverageSpend(trends: ISpendingTrend[]): number {
  if (trends.length === 0) return 0;
  const total = trends.reduce((sum, item) => sum + item.totalSpent, 0);
  return total / trends.length;
}

interface TrendFrameProps {
  children: ReactNode;
  subtitle?: string;
  busy?: boolean;
}

function TrendFrame({ children, subtitle, busy = false }: TrendFrameProps) {
  return (
    <article
      aria-labelledby="spending-trend-title"
      aria-busy={busy}
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="spending-trend-title" className="text-sm font-semibold text-capitec-navy">
          Monthly spending trend
        </h2>
        {subtitle && <p className="text-xs font-semibold text-capitec-blue tabular-nums">{subtitle}</p>}
      </div>
      {children}
    </article>
  );
}

function TrendSkeleton() {
  return (
    <div aria-hidden="true" className="mt-4">
      <div className="skeleton h-44 w-full rounded-xl" />
    </div>
  );
}

interface SpendingTrendChartProps {
  trends: ISpendingTrend[];
  isLoading: boolean;
}

export function SpendingTrendChart({ trends, isLoading }: SpendingTrendChartProps) {
  if (isLoading) {
    return (
      <TrendFrame busy>
        <TrendSkeleton />
      </TrendFrame>
    );
  }

  if (trends.length === 0) {
    return (
      <TrendFrame>
        <p className="mt-3 text-sm text-slate-500">No monthly trend data available.</p>
      </TrendFrame>
    );
  }

  const chartData = trends.map((item) => ({
    ...item,
    label: formatMonthLabel(item.month),
  }));
  const averageSpend = getAverageSpend(trends);

  return (
    <TrendFrame subtitle={`Avg ${formatZAR(averageSpend)} / mo`}>
      <div className="mt-4 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="spendTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#009de0" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#009de0" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#00486d', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAxisRand}
              tick={{ fill: '#00486d', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [formatZAR(Number(value)), 'Total spent']}
              contentStyle={{
                borderRadius: '0.75rem',
                borderColor: '#009de0',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#002b49',
              }}
            />
            <Area
              type="monotone"
              dataKey="totalSpent"
              stroke="#009de0"
              strokeWidth={2.5}
              fill="url(#spendTrendFill)"
              activeDot={{ r: 4, fill: '#00486d', stroke: '#ffffff', strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </TrendFrame>
  );
}
