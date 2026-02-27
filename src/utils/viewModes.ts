import { ViewMode } from '../models/enums';
import { OnHandInventory, MovementVelocity } from '../models/inventory';
import { WarehouseConfig } from '../models/warehouse';

// ─── View Mode Metadata ───
export interface ViewModeOption {
  mode: ViewMode;
  label: string;
  icon: string;
  description: string;
}

export const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  {
    mode: ViewMode.LocationType,
    label: 'Location Type',
    icon: '🏷️',
    description: 'Color by location purpose (Receiving, Dispatch, Quality, etc.)',
  },
  {
    mode: ViewMode.HeatMap,
    label: 'Activity Heat Map',
    icon: '🔥',
    description: 'Movement frequency — hot zones vs. cold zones',
  },
  {
    mode: ViewMode.ABCClassification,
    label: 'ABC Classification',
    icon: '📊',
    description: 'Velocity-based A/B/C category for slotting analysis',
  },
  {
    mode: ViewMode.InventoryAging,
    label: 'Inventory Aging',
    icon: '⏳',
    description: 'Days since receipt — identify slow-moving stock',
  },
  {
    mode: ViewMode.CycleCount,
    label: 'Cycle Count Status',
    icon: '📋',
    description: 'Count schedule status — overdue, due soon, completed',
  },
  {
    mode: ViewMode.Utilization,
    label: 'Space Utilization',
    icon: '📦',
    description: 'Capacity fill percentage per location',
  },
];

// ─── KPI Aggregation ───
export interface WarehouseKPIs {
  totalLocations: number;
  occupiedLocations: number;
  emptyLocations: number;
  overallUtilization: number;
  totalSKUs: number;
  totalQuantity: number;
  avgFillPercent: number;
  locationsByType: Record<string, number>;
  agingBreakdown: { range: string; count: number }[];
  abcBreakdown: { cls: string; count: number; pct: number }[];
}

export function computeKPIs(
  config: WarehouseConfig,
  inventory: OnHandInventory[],
  velocityData: MovementVelocity[],
): WarehouseKPIs {
  const totalLocations = config.locations.length;
  const locationHasInv = new Set(inventory.map((i) => i.locationId));
  const occupiedLocations = config.locations.filter((l) =>
    locationHasInv.has(l.locationId),
  ).length;

  const skuSet = new Set(inventory.map((i) => i.itemNumber));
  const totalQuantity = inventory.reduce((s, i) => s + i.quantity, 0);

  const locMap: Record<string, { qty: number; capacity: number }> = {};
  for (const loc of config.locations) {
    locMap[loc.locationId] = { qty: 0, capacity: loc.maxCapacity };
  }
  for (const inv of inventory) {
    if (locMap[inv.locationId]) {
      locMap[inv.locationId].qty += inv.quantity;
    }
  }
  const fillPcts = Object.values(locMap).map((l) =>
    l.capacity > 0 ? Math.min(100, (l.qty / l.capacity) * 100) : 0,
  );
  const avgFillPercent =
    fillPcts.length > 0
      ? fillPcts.reduce((s, p) => s + p, 0) / fillPcts.length
      : 0;
  const overallUtilization =
    totalLocations > 0 ? (occupiedLocations / totalLocations) * 100 : 0;

  const locationsByType: Record<string, number> = {};
  for (const loc of config.locations) {
    locationsByType[loc.locationType] =
      (locationsByType[loc.locationType] || 0) + 1;
  }

  const now = new Date();
  const agingBuckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
  for (const inv of inventory) {
    if (!inv.receiptDate) continue;
    const days = Math.floor(
      (now.getTime() - new Date(inv.receiptDate).getTime()) / 86400000,
    );
    if (days <= 30) agingBuckets['0-30']++;
    else if (days <= 60) agingBuckets['31-60']++;
    else if (days <= 90) agingBuckets['61-90']++;
    else agingBuckets['90+']++;
  }

  const abcMap: Record<string, number> = { A: 0, B: 0, C: 0, Unclassified: 0 };
  for (const v of velocityData) {
    abcMap[v.velocityClass] = (abcMap[v.velocityClass] || 0) + 1;
  }
  const velTotal = velocityData.length || 1;

  return {
    totalLocations,
    occupiedLocations,
    emptyLocations: totalLocations - occupiedLocations,
    overallUtilization: Math.round(overallUtilization * 10) / 10,
    totalSKUs: skuSet.size,
    totalQuantity,
    avgFillPercent: Math.round(avgFillPercent * 10) / 10,
    locationsByType,
    agingBreakdown: Object.entries(agingBuckets).map(([range, count]) => ({
      range,
      count,
    })),
    abcBreakdown: Object.entries(abcMap).map(([cls, count]) => ({
      cls,
      count,
      pct: Math.round((count / velTotal) * 1000) / 10,
    })),
  };
}

// ─── Search Helpers ───
export function searchLocations(
  config: WarehouseConfig,
  inventory: OnHandInventory[],
  query: string,
): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const matchedLocationIds = new Set<string>();

  for (const loc of config.locations) {
    if (loc.locationId.toLowerCase().includes(q)) {
      matchedLocationIds.add(loc.locationId);
    }
  }

  for (const inv of inventory) {
    if (
      inv.itemNumber.toLowerCase().includes(q) ||
      (inv.itemName && inv.itemName.toLowerCase().includes(q)) ||
      (inv.licensePlate && inv.licensePlate.toLowerCase().includes(q)) ||
      (inv.batchNumber && inv.batchNumber.toLowerCase().includes(q)) ||
      (inv.serialNumber && inv.serialNumber.toLowerCase().includes(q))
    ) {
      matchedLocationIds.add(inv.locationId);
    }
  }

  return Array.from(matchedLocationIds);
}
