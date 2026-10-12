export type SpendingPeriod = '7d' | '30d' | '90d' | '1y';
export type GoalStatus = 'on_track' | 'warning';
export type SortOrder = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface ICustomerProfile {
    customerId: string;
    name: string;
    email: string;
    joinDate: string;
    accountType: string;
    totalSpent: number;
    currency: string;
}

export interface ISpendingComparison {
    spentChange: number;
    transactionChange: number;
}

export interface ISpendingSummary {
    period: SpendingPeriod;
    totalSpent: number;
    transactionCount: number;
    topCategory: string;
    comparedToPrevious: ISpendingComparison
}

export interface ISpendingCategory {
    name: string;
    amount: number;
    percentage: number;
    transactionCount: number;
    color: string;
    icon: string;
}

export interface ISpendingTrend {
    month: string;
    totalSpent: number;
    transactionCount: number;
    averageTransaction: number;
}

export interface ISpendingGoal {
    id: string;
    category: string;
    monthlyBudget: number;
    currentSpent: number;
    percentageUsed: number;
    daysRemaining: number;
    status: GoalStatus;
}

export interface Transaction {
    id: string;
    date: string;
    merchant: string;
    category: string;
    amount: number;
    description: string;
    paymentMethod: string;
    icon: string;
    categoryColor: string;
}

export interface SpendingDashboardData {
    profile: ICustomerProfile;
    summary: ISpendingSummary;
    categories: ISpendingCategory[];
    trends: ISpendingTrend;
    goals: ISpendingGoal;
    transactions: Transaction;
}