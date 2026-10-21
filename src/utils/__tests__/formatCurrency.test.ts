import { describe, expect, it } from 'vitest';
import { formatPercent, formatZAR } from '../formatCurrency';

describe('formatZAR', () => {
  it('formats standard positive amounts in South African Rands', () => {
    expect(formatZAR(14250)).toBe('R 14,250.00');
    expect(formatZAR(4250.75)).toBe('R 4,250.75');
    expect(formatZAR(0)).toBe('R 0.00');
  });

  it('prefixes negative amounts with a minus sign before the Rand symbol', () => {
    expect(formatZAR(-245.8)).toBe('-R 245.80');
  });
});

describe('formatPercent', () => {
  it('formats unsigned percentage magnitudes to one decimal place', () => {
    expect(formatPercent(12.5)).toBe('12.5%');
    expect(formatPercent(-8.3)).toBe('8.3%');
    expect(formatPercent(0)).toBe('0.0%');
  });
});
