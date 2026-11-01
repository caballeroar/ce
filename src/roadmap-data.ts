export type Road = { id: string; name: string; color: string };
export type Indicator = {
  id: string;
  name: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  weight: number;
  confidence: number;
  note: string;
};
export type Path = {
  id: string;
  name: string;
  color: string;
  health: number;
  description: string;
  status: "Actief" | "Gepland";
};
export type Rule = {
  road: string;
  indicator: string;
  operator: string;
  value: string;
  recommendation: string;
  active: boolean;
};

export type RoadmapData = {
  paths: Path[];
  indicators: Record<string, Indicator[]>;
  rules: Rule[];
  roads: Road[];
  years: number[];
};

export const emptyRoadmapData: RoadmapData = {
  paths: [],
  indicators: {},
  rules: [],
  roads: [],
  years: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isIndicator(value: unknown): value is Indicator {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.name) &&
    isString(value.category) &&
    typeof value.current === "number" &&
    typeof value.target === "number" &&
    isString(value.unit) &&
    typeof value.weight === "number" &&
    typeof value.confidence === "number" &&
    isString(value.note)
  );
}

export function isRoadmapData(value: unknown): value is RoadmapData {
  if (!isRecord(value)) return false;
  if (
    !Array.isArray(value.paths) ||
    !Array.isArray(value.rules) ||
    !Array.isArray(value.roads) ||
    !Array.isArray(value.years) ||
    !isRecord(value.indicators)
  ) {
    return false;
  }

  const validPaths = value.paths.every(
    (path) =>
      isRecord(path) &&
      isString(path.id) &&
      isString(path.name) &&
      isString(path.color) &&
      typeof path.health === "number" &&
      isString(path.description) &&
      (path.status === "Actief" || path.status === "Gepland"),
  );
  const validRoads = value.roads.every(
    (road) =>
      isRecord(road) &&
      isString(road.id) &&
      isString(road.name) &&
      isString(road.color),
  );
  const validRules = value.rules.every(
    (rule) =>
      isRecord(rule) &&
      isString(rule.road) &&
      isString(rule.indicator) &&
      isString(rule.operator) &&
      isString(rule.value) &&
      isString(rule.recommendation) &&
      typeof rule.active === "boolean",
  );
  const validIndicators = Object.values(value.indicators).every(
    (items) => Array.isArray(items) && items.every(isIndicator),
  );

  return (
    validPaths &&
    validRoads &&
    validRules &&
    validIndicators &&
    value.years.every(
      (year) =>
        typeof year === "number" &&
        Number.isInteger(year) &&
        year >= 1900 &&
        year <= 2200,
    )
  );
}
