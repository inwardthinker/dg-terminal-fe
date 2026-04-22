export const formatBalance = (value: number): string =>
  `$${value.toLocaleString("en-US")}`;

export const formatSignedCurrency = (value: number): string =>
  `${value >= 0 ? "+" : ""}$${Math.abs(value).toLocaleString("en-US")}`;

export const formatSignedPercent = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatRewardsShare = (value: number): string => `${value}% of P&L`;

export function formatKpiFallback<T>(
  value: T | undefined,
  formatter: (input: T) => string,
): string {
  return value !== undefined ? formatter(value) : "--";
}

export function getKpiVariant(
  value?: number,
): "default" | "positive" | "negative" {
  if (value === undefined) return "default";
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "default";
}
