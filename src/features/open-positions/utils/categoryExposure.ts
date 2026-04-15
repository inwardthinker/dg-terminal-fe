import type { Position } from "../types";

export type CategoryPresentation = {
  label: string;
  colorClass: string;
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
  const defaultPresentation = positions.reduce(
    (acc, position) => {
      acc[position.category] = {
        label: position.category,
        colorClass: OTHER_COLOR_CLASS,
      };
      return acc;
    },
    {} as Record<Position["category"], CategoryPresentation>,
  );

  if (positions.length === 0) {
    return defaultPresentation;
  }

  const exposureByCategory = positions.reduce((acc, position) => {
    const next = (acc[position.category] ?? 0) + Math.abs(position.size);
    acc[position.category] = next;
    return acc;
  }, {} as Partial<Record<Position["category"], number>>);

  const totalExposure = Object.values(exposureByCategory).reduce(
    (sum, exposure) => sum + (exposure ?? 0),
    0,
  );
  if (totalExposure <= 0) {
    return defaultPresentation;
  }

  const threshold = totalExposure * MIN_EXPOSURE_SHARE;
  const rankedCategories = Object.entries(exposureByCategory)
    .filter(([, exposure]) => (exposure ?? 0) >= threshold)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
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

  (Object.keys(exposureByCategory) as Position["category"][])
    .filter((category) => !rankedSet.has(category))
    .forEach((category) => {
      presentation[category] = {
        label: OTHER_LABEL,
        colorClass: OTHER_COLOR_CLASS,
      };
    });

  return presentation;
}
