import { WarehouseConfig, RenderedLocation, ZoneLayout } from '../models/warehouse';
import { LocationType, ViewMode } from '../models/enums';
import { OnHandInventory, MovementVelocity, CycleCountRecord, LocationSummary } from '../models/inventory';
import {
  LOCATION_TYPE_COLORS,
  getHeatMapColor,
  getAgingColor,
  getUtilizationColor,
  ABC_COLORS,
  CYCLE_COUNT_COLORS,
  EMPTY_LOCATION_COLOR,
  EMPTY_LOCATION_OPACITY,
} from './colorMapping';
import { VelocityClass, CycleCountStatus } from '../models/enums';
import { differenceInDays } from 'date-fns';

// ─── Geometry Constants ───
const LOCATION_WIDTH = 2.0;
const LOCATION_HEIGHT = 1.2;
const LOCATION_DEPTH = 1.6;
const GAP = 0.2;

const RACK_GAP = 2.0;
const AISLE_WIDTH = 3.5;
const ZONE_GAP = 4.0;
const FLOOR_Y = 0;
const GRID_COLS = 3;

// ─── Zone Layout Calculation ───
export function computeZoneLayouts(config: WarehouseConfig): ZoneLayout[] {
  const zones = config.zones;
  const layouts: ZoneLayout[] = [];

  const zoneDims = zones.map((zone) => ({
    zone,
    width: computeZoneWidth(config, zone.zoneId),
    depth: computeZoneDepth(config, zone.zoneId),
    aisleCount: config.aisles.filter((a) => a.zone === zone.zoneId).length,
  }));

  let currentRowZ = 0;
  for (let row = 0; row * GRID_COLS < zoneDims.length; row++) {
    const rowStart = row * GRID_COLS;
    const rowEnd = Math.min(rowStart + GRID_COLS, zoneDims.length);
    const rowItems = zoneDims.slice(rowStart, rowEnd);

    const rowDepth = Math.max(...rowItems.map((d) => d.depth));

    let currentX = 0;
    for (const dim of rowItems) {
      layouts.push({
        zoneId: dim.zone.zoneId,
        label: dim.zone.name,
        x: currentX,
        z: currentRowZ,
        width: dim.width,
        depth: dim.depth,
        aisleCount: dim.aisleCount,
      });
      currentX += dim.width + ZONE_GAP;
    }

    currentRowZ += rowDepth + ZONE_GAP;
  }

  return layouts;
}

function computeZoneWidth(config: WarehouseConfig, zoneId: string): number {
  const zoneAisles = config.aisles.filter((a) => a.zone === zoneId);
  if (zoneAisles.length === 0) return 10;

  return zoneAisles.length * (2 * LOCATION_DEPTH + AISLE_WIDTH) + RACK_GAP;
}

function computeZoneDepth(config: WarehouseConfig, zoneId: string): number {
  const zoneAisles = config.aisles.filter((a) => a.zone === zoneId);
  let maxRackLength = 0;
  for (const aisle of zoneAisles) {
    const aisleRacks = config.racks.filter((r) => r.aisleId === aisle.aisleId);
    for (const rack of aisleRacks) {
      const rackLocations = config.locations.filter((l) => l.rack === rack.rackId);
      const positions = new Set(rackLocations.map((l) => l.position));
      maxRackLength = Math.max(maxRackLength, positions.size);
    }
  }
  return maxRackLength * (LOCATION_WIDTH + GAP);
}

// ─── Main Layout Engine ───
export function buildRenderedLocations(
  config: WarehouseConfig,
  viewMode: ViewMode,
  inventory: OnHandInventory[],
  velocityData: MovementVelocity[],
  cycleCountData: CycleCountRecord[],
): RenderedLocation[] {
  const rendered: RenderedLocation[] = [];
  const zoneLayouts = computeZoneLayouts(config);
  const inventoryByLocation = groupByLocation(inventory);
  const velocityByLocation = groupVelocityByLocation(velocityData);
  const cycleCountByLocation = groupCycleCountByLocation(cycleCountData);

  for (const zone of config.zones) {
    const zoneLayout = zoneLayouts.find((z) => z.zoneId === zone.zoneId);
    if (!zoneLayout) continue;

    const zoneAisles = config.aisles.filter((a) => a.zone === zone.zoneId);

    zoneAisles.forEach((aisle, aisleIdx) => {
      const aisleRacks = config.racks.filter((r) => r.aisleId === aisle.aisleId);

      aisleRacks.forEach((rack, rackSide) => {
        const rackLocations = config.locations.filter((l) => l.rack === rack.rackId);

        const shelves = Array.from(new Set(rackLocations.map((l) => l.shelf))).sort();
        const positions = Array.from(new Set(rackLocations.map((l) => l.position))).sort();

        positions.forEach((pos, posIdx) => {
          shelves.forEach((shelf, shelfIdx) => {
            const loc = rackLocations.find(
              (l) => l.shelf === shelf && l.position === pos,
            );
            if (!loc) return;

            const locInv = inventoryByLocation[loc.locationId] || [];
            const summary = computeLocationSummary(loc.locationId, locInv, loc.maxCapacity);

            const x =
              zoneLayout.x +
              aisleIdx * (2 * LOCATION_DEPTH + AISLE_WIDTH) +
              rackSide * (LOCATION_DEPTH + RACK_GAP);
            const y = FLOOR_Y + shelfIdx * (LOCATION_HEIGHT + GAP);
            const z = zoneLayout.z + posIdx * (LOCATION_WIDTH + GAP);

            const { color, opacity, wireframe } = getVisualProps(
              viewMode,
              loc,
              summary,
              velocityByLocation[loc.locationId],
              cycleCountByLocation[loc.locationId],
            );

            rendered.push({
              locationId: loc.locationId,
              x,
              y,
              z,
              width: LOCATION_WIDTH,
              height: LOCATION_HEIGHT,
              depth: LOCATION_DEPTH,
              color,
              opacity,
              wireframe,
              metadata: {
                zone: zone.name,
                aisle: aisle.aisleId,
                rack: rack.rackId,
                shelf,
                position: pos,
                locationType: loc.locationType,
                isLPControlled: loc.isLPControlled,
                itemCount: summary.itemCount,
                totalQuantity: summary.totalQty,
                fillPercent: summary.fillPercent,
              },
            });
          });
        });
      });
    });
  }

  return rendered;
}

// ─── Visual Property Resolver ───
function getVisualProps(
  mode: ViewMode,
  loc: { locationType: LocationType; locationId: string },
  summary: LocationSummary,
  velocity: MovementVelocity | undefined,
  cycleCount: CycleCountRecord | undefined,
): { color: string; opacity: number; wireframe: boolean } {
  const isEmpty = summary.itemCount === 0;

  switch (mode) {
    case ViewMode.LocationType:
      return {
        color: LOCATION_TYPE_COLORS[loc.locationType],
        opacity: isEmpty ? 0.35 : 0.92,
        wireframe: isEmpty,
      };

    case ViewMode.HeatMap: {
      const freq = velocity?.normalizedFrequency ?? 0;
      return {
        color: isEmpty && freq === 0 ? EMPTY_LOCATION_COLOR : getHeatMapColor(freq),
        opacity: isEmpty && freq === 0 ? EMPTY_LOCATION_OPACITY : 0.85,
        wireframe: false,
      };
    }

    case ViewMode.ABCClassification: {
      const cls = velocity?.velocityClass ?? VelocityClass.Unclassified;
      return {
        color: ABC_COLORS[cls],
        opacity: 0.85,
        wireframe: cls === VelocityClass.Unclassified,
      };
    }

    case ViewMode.InventoryAging: {
      const maxAge = summary.maxAgeDays ?? 0;
      return {
        color: isEmpty ? EMPTY_LOCATION_COLOR : getAgingColor(maxAge),
        opacity: isEmpty ? EMPTY_LOCATION_OPACITY : 0.85,
        wireframe: isEmpty,
      };
    }

    case ViewMode.CycleCount: {
      const status = cycleCount?.status ?? CycleCountStatus.NotScheduled;
      return {
        color: CYCLE_COUNT_COLORS[status],
        opacity: 0.85,
        wireframe: false,
      };
    }

    case ViewMode.Utilization:
      return {
        color: getUtilizationColor(summary.fillPercent),
        opacity: isEmpty ? EMPTY_LOCATION_OPACITY : 0.85,
        wireframe: isEmpty,
      };

    default:
      return {
        color: LOCATION_TYPE_COLORS[loc.locationType],
        opacity: 0.85,
        wireframe: false,
      };
  }
}

// ─── Helpers ───
function groupByLocation(inv: OnHandInventory[]): Record<string, OnHandInventory[]> {
  const map: Record<string, OnHandInventory[]> = {};
  for (const item of inv) {
    if (!map[item.locationId]) map[item.locationId] = [];
    map[item.locationId].push(item);
  }
  return map;
}

function groupVelocityByLocation(data: MovementVelocity[]): Record<string, MovementVelocity> {
  const map: Record<string, MovementVelocity> = {};
  for (const d of data) {
    map[d.locationId] = d;
  }
  return map;
}

function groupCycleCountByLocation(data: CycleCountRecord[]): Record<string, CycleCountRecord> {
  const map: Record<string, CycleCountRecord> = {};
  for (const d of data) {
    map[d.locationId] = d;
  }
  return map;
}

export function computeLocationSummary(
  locationId: string,
  inventory: OnHandInventory[],
  maxCapacity: number,
): LocationSummary {
  const now = new Date();
  const totalQty = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const itemCount = inventory.length;
  const fillPercent = maxCapacity > 0 ? Math.min(100, (totalQty / maxCapacity) * 100) : 0;

  let maxAgeDays: number | undefined;
  if (inventory.length > 0) {
    const ages = inventory.map((i) =>
      i.receiptDate ? differenceInDays(now, new Date(i.receiptDate)) : 0,
    );
    maxAgeDays = Math.max(...ages);
  }

  return {
    locationId,
    itemCount,
    totalQty,
    fillPercent,
    maxAgeDays,
  };
}
