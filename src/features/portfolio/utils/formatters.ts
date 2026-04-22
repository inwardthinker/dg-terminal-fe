export const formatBalance = (value: number): string =>
  `$${value.toLocaleString("en-US")}`;

export const formatSignedCurrency = (value: number): string =>
  `${value >= 0 ? "+" : ""}$${Math.abs(value).toLocaleString("en-US")}`;

export const formatSignedPercent = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatRewardsShare = (value: number): string => `${value}% of P&L`;

export function formatKpiFallback<T>(
  value: T | null | undefined,
  formatter: (input: T) => string,
): string {
  return value != null ? formatter(value) : "--";
}

export function getKpiVariant(
  value?: number | null,
): "default" | "positive" | "negative" {
  if (value == null) return "default";
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "default";
}
