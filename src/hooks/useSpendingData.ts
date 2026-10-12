import { useState, useEffect } from 'react';
import type {
  ICustomerProfile,
  ISpendingSummary,
  ISpendingCategory,
  ISpendingTrend,
  ISpendingGoal,
  Transaction,
  SpendingPeriod,
} from '../types/spending';
import { spendingService } from '../services/spendingService';

interface DashboardData {
  profile: ICustomerProfile | null;
  summary: ISpendingSummary | null;
  categories: ISpendingCategory[];
  trends: ISpendingTrend[];
  goals: ISpendingGoal[];
  transactions: Transaction[];
}

interface DashboardState {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;
}

const emptyData: DashboardData = {
  profile: null,
  summary: null,
  categories: [],
  trends: [],
  goals: [],
  transactions: [],
};

const initialState: DashboardState = {
  data: emptyData,
  isLoading: true,
  error: null,
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return 'System communication failed.';
}

async function fetchAllSpending(period: SpendingPeriod, category?: string): Promise<DashboardData> {
  const [profile, summary, categories, trends, goals, transactions] = await Promise.all([
    spendingService.getProfile(),
    spendingService.getSummary(period),
    spendingService.getCategories(period),
    spendingService.getTrends(),
    spendingService.getGoals(),
    spendingService.getTransactions(category),
  ]);

  return { profile, summary, categories, trends, goals, transactions };
}

async function getDashboardSnapshot(period: SpendingPeriod, category?: string): Promise<DashboardState> {
  try {
    const data = await fetchAllSpending(period, category);
    return { data, isLoading: false, error: null };
  } catch (err: unknown) {
    return { data: emptyData, isLoading: false, error: getErrorMessage(err) };
  }
}

function runDataFetch(
  period: SpendingPeriod,
  category: string | undefined,
  onResolve: (state: DashboardState) => void
) {
  let active = true;

  getDashboardSnapshot(period, category).then((snapshot) => {
    if (active) onResolve(snapshot);
  });

  return () => {
    active = false;
  };
}

function nextCount(val: number): number {
  return val + 1;
}

export function useSpendingData(initialPeriod: SpendingPeriod = '30d') {
  const [period, setPeriod] = useState<SpendingPeriod>(initialPeriod);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => runDataFetch(period, selectedCategory, setState), [period, selectedCategory, refreshKey]);

  return {
    ...state.data,
    isLoading: state.isLoading,
    error: state.error,
    period,
    setPeriod,
    selectedCategory,
    setSelectedCategory,
    refresh: () => setRefreshKey(nextCount),
  };
}