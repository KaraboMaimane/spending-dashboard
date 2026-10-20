const randNumberFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatZAR(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}R ${randNumberFormat.format(Math.abs(amount))}`;
}

export function formatPercent(value: number): string {
  return `${percentFormat.format(Math.abs(value))}%`;
}
