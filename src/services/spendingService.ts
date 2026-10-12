import type {
  ICustomerProfile,
  ISpendingSummary,
  ISpendingCategory,
  ISpendingTrend,
  ISpendingGoal,
  Transaction,
  SpendingPeriod,
} from '../types/spending';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const spendingService = {
  async getProfile(): Promise<ICustomerProfile> {
    const res = await fetch(`${BASE_URL}/profile`);
    return handleResponse<ICustomerProfile>(res);
  },

  async getSummary(period: SpendingPeriod = '30d'): Promise<ISpendingSummary> {
    const res = await fetch(`${BASE_URL}/summary?period=${period}`);
    return handleResponse<ISpendingSummary>(res);
  },

  async getCategories(period: SpendingPeriod = '30d'): Promise<ISpendingCategory[]> {
    const res = await fetch(`${BASE_URL}/categories?period=${period}`);
    return handleResponse<ISpendingCategory[]>(res);
  },

  async getTrends(months = 6): Promise<ISpendingTrend[]> {
    const res = await fetch(`${BASE_URL}/trends?months=${months}`);
    return handleResponse<ISpendingTrend[]>(res);
  },

  async getGoals(): Promise<ISpendingGoal[]> {
    const res = await fetch(`${BASE_URL}/goals`);
    return handleResponse<ISpendingGoal[]>(res);
  },

  async getTransactions(category?: string): Promise<Transaction[]> {
    const targetUrl = category
      ? `${BASE_URL}/transactions?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/transactions`;
    const res = await fetch(targetUrl);
    return handleResponse<Transaction[]>(res);
  },
};