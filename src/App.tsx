import { useRef, useState } from 'react';
import { useSpendingData } from './hooks/useSpendingData';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { HeroSpendingCard } from './components/dashboard/HeroSpendingCard';
import { QuickActions } from './components/dashboard/QuickActions';
import { CategoryFilterPanel } from './components/dashboard/CategoryFilterPanel';
import { CategoryDistribution } from './components/dashboard/CategoryDistribution';
import { SpendingTrendChart } from './components/dashboard/SpendingTrendChart';
import { TransactionList } from './components/dashboard/TransactionList';

const FILTER_PANEL_ID = 'dashboard-category-filters';
const REFRESH_FEEDBACK_MS = 350;

function App() {
  const {
    profile,
    summary,
    categories,
    trends,
    transactions,
    isLoading,
    error,
    period,
    setPeriod,
    selectedCategory,
    setSelectedCategory,
    refresh,
  } = useSpendingData();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = useRef<number | null>(null);

  const activeCategory = categories.find((cat) => cat.name === selectedCategory);
  const busy = isLoading || isRefreshing;

  const handleRefresh = () => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
    }
    setIsRefreshing(true);
    refresh();
    refreshTimerRef.current = window.setTimeout(() => {
      setIsRefreshing(false);
    }, REFRESH_FEEDBACK_MS);
  };

  return (
    <DashboardLayout
      userName={profile?.name}
      isLoading={isLoading}
      period={period}
      onPeriodChange={setPeriod}
      primary={
        <>
          <HeroSpendingCard
            summary={summary}
            period={period}
            activeCategory={activeCategory}
            onClearCategory={() => setSelectedCategory(undefined)}
            isLoading={busy}
            error={error}
            onRetry={handleRefresh}
          />
          <QuickActions
            onRefresh={handleRefresh}
            onToggleFilters={() => setFiltersOpen((open) => !open)}
            filtersOpen={filtersOpen}
            filtersPanelId={FILTER_PANEL_ID}
            activeFilter={selectedCategory}
            isRefreshing={isRefreshing}
            disabled={isLoading}
          />
          {filtersOpen && (
            <CategoryFilterPanel
              id={FILTER_PANEL_ID}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              onClose={() => setFiltersOpen(false)}
            />
          )}
          <TransactionList
            transactions={transactions}
            period={period}
            selectedCategory={selectedCategory}
            isLoading={busy}
            error={error}
          />
        </>
      }
      secondary={
        <>
          <CategoryDistribution
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isLoading={busy}
          />
          <SpendingTrendChart trends={trends} isLoading={busy} />
        </>
      }
    />
  );
}

export default App;
