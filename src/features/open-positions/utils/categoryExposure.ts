import type { Position } from "../types";

export type CategoryPresentation = {
  label: string;
  colorClass: string;
};

export type CategoryCount = {
  label: string;
  count: number;
};

export type CategoryData = {
  presentation: Record<Position["category"], CategoryPresentation>;
  counts: CategoryCount[];
};

const RANKED_COLOR_CLASSES = [
  "bg-blue",
  "bg-pos",
  "bg-neg",
  "bg-warn",
  "bg-pur",
  "bg-cyan",
  "bg-orange",
] as const;

const OTHER_COLOR_CLASS = "bg-t-3";
const OTHER_LABEL = "Other";
const MIN_EXPOSURE_SHARE = 0.05;

/**
 * Assign category colors by exposure rank (desc), not by category name.
 * Categories below 5% of total exposure are bucketed to "Other".
 */
export function buildCategoryPresentation(
  positions: Position[],
): Record<Position["category"], CategoryPresentation> {
  return buildCategoryData(positions).presentation;
}

export function buildCategoryData(positions: Position[]): CategoryData {
  const statsByCategory = positions.reduce(
    (acc, position) => {
      const previous = acc[position.category] ?? { exposure: 0, count: 0 };
      acc[position.category] = {
        exposure: previous.exposure + Math.abs(position.size),
        count: previous.count + 1,
      };
      return acc;
    },
    {} as Partial<Record<Position["category"], { exposure: number; count: number }>>,
  );

  const defaultPresentation = (Object.keys(statsByCategory) as Position["category"][]).reduce(
    (acc, category) => {
      acc[category] = {
        label: category,
        colorClass: OTHER_COLOR_CLASS,
      };
      return acc;
    },
    {} as Record<Position["category"], CategoryPresentation>,
  );

  if (positions.length === 0) {
    return { presentation: defaultPresentation, counts: [] };
  }

  const totalExposure = Object.values(statsByCategory).reduce(
    (sum, stat) => sum + (stat?.exposure ?? 0),
    0,
  );
  if (totalExposure <= 0) {
    const counts = (Object.keys(statsByCategory) as Position["category"][])
      .map((category) => ({
        label: category,
        count: statsByCategory[category]?.count ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { presentation: defaultPresentation, counts };
  }

  const threshold = totalExposure * MIN_EXPOSURE_SHARE;
  const rankedCategories = Object.entries(statsByCategory)
    .filter(([, stat]) => (stat?.exposure ?? 0) >= threshold)
    .sort((a, b) => (b[1]?.exposure ?? 0) - (a[1]?.exposure ?? 0))
    .map(([category]) => category as Position["category"]);

  const rankedSet = new Set(rankedCategories);
  const presentation = { ...defaultPresentation };

  rankedCategories.forEach((category, index) => {
    const colorClass =
      RANKED_COLOR_CLASSES[Math.min(index, RANKED_COLOR_CLASSES.length - 1)];
    presentation[category] = {
      label: category,
      colorClass,
    };
  });

  (Object.keys(statsByCategory) as Position["category"][])
    .filter((category) => !rankedSet.has(category))
    .forEach((category) => {
      presentation[category] = {
        label: OTHER_LABEL,
        colorClass: OTHER_COLOR_CLASS,
      };
    });

  const countsByLabel = (Object.keys(statsByCategory) as Position["category"][]).reduce(
    (acc, category) => {
      const label = presentation[category]?.label ?? category;
      const count = statsByCategory[category]?.count ?? 0;
      acc[label] = (acc[label] ?? 0) + count;
      return acc;
    },
    {} as Record<string, number>,
  );

  const counts = Object.entries(countsByLabel)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  return { presentation, counts };
}
