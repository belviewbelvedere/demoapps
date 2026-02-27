import {
  WarehouseConfig,
  WarehouseLocation,
  Zone,
  Aisle,
  Rack,
} from '../models/warehouse';
import {
  OnHandInventory,
  MovementVelocity,
  CycleCountRecord,
} from '../models/inventory';
import {
  LocationType,
  InventoryStatus,
  VelocityClass,
  CycleCountStatus,
} from '../models/enums';

// ── Zone definitions ──
const zones: Zone[] = [
  { zoneId: 'RCV', warehouseId: 'WH-01', name: 'Receiving', locationType: LocationType.Receiving },
  { zoneId: 'BULK', warehouseId: 'WH-01', name: 'Bulk Storage', locationType: LocationType.BulkStorage },
  { zoneId: 'PICK', warehouseId: 'WH-01', name: 'Pick / LP Tracking', locationType: LocationType.FixedLPTracking },
  { zoneId: 'STAGE', warehouseId: 'WH-01', name: 'Staging', locationType: LocationType.Staging },
  { zoneId: 'DISP', warehouseId: 'WH-01', name: 'Dispatch', locationType: LocationType.Dispatch },
  { zoneId: 'QC', warehouseId: 'WH-01', name: 'Quality Inspection', locationType: LocationType.QualityInspection },
];

// ── Aisle definitions ──
const aisles: Aisle[] = [
  { aisleId: 'RCV-A1', warehouseId: 'WH-01', zone: 'RCV', name: 'Receiving Dock A' },
  { aisleId: 'BULK-A1', warehouseId: 'WH-01', zone: 'BULK', name: 'Bulk Aisle 1' },
  { aisleId: 'BULK-A2', warehouseId: 'WH-01', zone: 'BULK', name: 'Bulk Aisle 2' },
  { aisleId: 'BULK-A3', warehouseId: 'WH-01', zone: 'BULK', name: 'Bulk Aisle 3' },
  { aisleId: 'PICK-A1', warehouseId: 'WH-01', zone: 'PICK', name: 'Pick Aisle 1' },
  { aisleId: 'PICK-A2', warehouseId: 'WH-01', zone: 'PICK', name: 'Pick Aisle 2' },
  { aisleId: 'STAGE-A1', warehouseId: 'WH-01', zone: 'STAGE', name: 'Staging Aisle' },
  { aisleId: 'DISP-A1', warehouseId: 'WH-01', zone: 'DISP', name: 'Dispatch Dock' },
  { aisleId: 'QC-A1', warehouseId: 'WH-01', zone: 'QC', name: 'QC Aisle' },
];

// ── Rack definitions ──
const racks: Rack[] = [
  { rackId: 'RCV-A1-R1', warehouseId: 'WH-01', zone: 'RCV', aisleId: 'RCV-A1', name: 'Rack 1', shelfCount: 2, positionsPerShelf: 4 },
  { rackId: 'RCV-A1-R2', warehouseId: 'WH-01', zone: 'RCV', aisleId: 'RCV-A1', name: 'Rack 2', shelfCount: 2, positionsPerShelf: 4 },
  { rackId: 'BULK-A1-R1', warehouseId: 'WH-01', zone: 'BULK', aisleId: 'BULK-A1', name: 'Rack 1', shelfCount: 4, positionsPerShelf: 6 },
  { rackId: 'BULK-A1-R2', warehouseId: 'WH-01', zone: 'BULK', aisleId: 'BULK-A1', name: 'Rack 2', shelfCount: 4, positionsPerShelf: 6 },
  { rackId: 'BULK-A2-R1', warehouseId: 'WH-01', zone: 'BULK', aisleId: 'BULK-A2', name: 'Rack 1', shelfCount: 4, positionsPerShelf: 6 },
  { rackId: 'BULK-A2-R2', warehouseId: 'WH-01', zone: 'BULK', aisleId: 'BULK-A2', name: 'Rack 2', shelfCount: 4, positionsPerShelf: 6 },
  { rackId: 'BULK-A3-R1', warehouseId: 'WH-01', zone: 'BULK', aisleId: 'BULK-A3', name: 'Rack 1', shelfCount: 4, positionsPerShelf: 6 },
  { rackId: 'BULK-A3-R2', warehouseId: 'WH-01', zone: 'BULK', aisleId: 'BULK-A3', name: 'Rack 2', shelfCount: 4, positionsPerShelf: 6 },
  { rackId: 'PICK-A1-R1', warehouseId: 'WH-01', zone: 'PICK', aisleId: 'PICK-A1', name: 'Rack 1', shelfCount: 3, positionsPerShelf: 8 },
  { rackId: 'PICK-A1-R2', warehouseId: 'WH-01', zone: 'PICK', aisleId: 'PICK-A1', name: 'Rack 2', shelfCount: 3, positionsPerShelf: 8 },
  { rackId: 'PICK-A2-R1', warehouseId: 'WH-01', zone: 'PICK', aisleId: 'PICK-A2', name: 'Rack 1', shelfCount: 3, positionsPerShelf: 8 },
  { rackId: 'PICK-A2-R2', warehouseId: 'WH-01', zone: 'PICK', aisleId: 'PICK-A2', name: 'Rack 2', shelfCount: 3, positionsPerShelf: 8 },
  { rackId: 'STAGE-A1-R1', warehouseId: 'WH-01', zone: 'STAGE', aisleId: 'STAGE-A1', name: 'Rack 1', shelfCount: 2, positionsPerShelf: 5 },
  { rackId: 'STAGE-A1-R2', warehouseId: 'WH-01', zone: 'STAGE', aisleId: 'STAGE-A1', name: 'Rack 2', shelfCount: 2, positionsPerShelf: 5 },
  { rackId: 'DISP-A1-R1', warehouseId: 'WH-01', zone: 'DISP', aisleId: 'DISP-A1', name: 'Rack 1', shelfCount: 2, positionsPerShelf: 4 },
  { rackId: 'DISP-A1-R2', warehouseId: 'WH-01', zone: 'DISP', aisleId: 'DISP-A1', name: 'Rack 2', shelfCount: 2, positionsPerShelf: 4 },
  { rackId: 'QC-A1-R1', warehouseId: 'WH-01', zone: 'QC', aisleId: 'QC-A1', name: 'Rack 1', shelfCount: 2, positionsPerShelf: 4 },
  { rackId: 'QC-A1-R2', warehouseId: 'WH-01', zone: 'QC', aisleId: 'QC-A1', name: 'Rack 2', shelfCount: 2, positionsPerShelf: 4 },
];

// ── Generate Locations ──
function buildLocations(): WarehouseLocation[] {
  const locations: WarehouseLocation[] = [];
  const zoneTypeMap: Record<string, LocationType> = {};
  for (const z of zones) zoneTypeMap[z.zoneId] = z.locationType;

  for (const rack of racks) {
    for (let s = 1; s <= rack.shelfCount; s++) {
      for (let p = 1; p <= rack.positionsPerShelf; p++) {
        const shelf = `S${s}`;
        const pos = `P${String(p).padStart(2, '0')}`;
        const locId = `${rack.rackId}-${shelf}-${pos}`;
        locations.push({
          locationId: locId,
          warehouseId: 'WH-01',
          zone: rack.zone,
          aisle: rack.aisleId,
          rack: rack.rackId,
          shelf,
          position: pos,
          locationType: zoneTypeMap[rack.zone],
          locationProfile: 'STD',
          isLPControlled: rack.zone === 'PICK',
          isFixed: rack.zone === 'PICK',
          maxCapacity: rack.zone === 'BULK' ? 100 : 50,
        });
      }
    }
  }
  return locations;
}

const locations = buildLocations();

export const sampleWarehouseConfig: WarehouseConfig = {
  warehouseId: 'WH-01',
  name: 'Main Distribution Center',
  description: 'D365FO Sample Warehouse — Digital Twin Demo',
  zones,
  aisles,
  racks,
  locations,
};

// ── Sample Items ──
const ITEMS = [
  { num: 'ITM-1001', name: 'Widget Alpha' },
  { num: 'ITM-1002', name: 'Gizmo Beta' },
  { num: 'ITM-1003', name: 'Bracket Gamma' },
  { num: 'ITM-1004', name: 'Sensor Delta' },
  { num: 'ITM-1005', name: 'Motor Epsilon' },
  { num: 'ITM-1006', name: 'Valve Zeta' },
  { num: 'ITM-1007', name: 'Pump Eta' },
  { num: 'ITM-1008', name: 'Filter Theta' },
  { num: 'ITM-1009', name: 'Bearing Iota' },
  { num: 'ITM-1010', name: 'Coupler Kappa' },
  { num: 'ITM-1011', name: 'Gasket Lambda' },
  { num: 'ITM-1012', name: 'Shaft Mu' },
  { num: 'ITM-1013', name: 'Spring Nu' },
  { num: 'ITM-1014', name: 'Hose Xi' },
  { num: 'ITM-1015', name: 'Clamp Omicron' },
];

const STATUSES: InventoryStatus[] = [
  InventoryStatus.Available,
  InventoryStatus.Available,
  InventoryStatus.Available,
  InventoryStatus.Reserved,
  InventoryStatus.OnOrder,
  InventoryStatus.Blocked,
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function daysAgo(d: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString().slice(0, 10);
}

export function generateSampleInventory(): OnHandInventory[] {
  const rand = seededRandom(42);
  const inv: OnHandInventory[] = [];

  for (const loc of locations) {
    if (rand() > 0.65) continue;
    const itemCount = Math.ceil(rand() * 3);
    for (let i = 0; i < itemCount; i++) {
      const item = ITEMS[Math.floor(rand() * ITEMS.length)];
      inv.push({
        locationId: loc.locationId,
        warehouseId: 'WH-01',
        itemNumber: item.num,
        itemName: item.name,
        quantity: Math.ceil(rand() * 80),
        unit: 'ea',
        licensePlate: loc.isLPControlled ? `LP-${Math.floor(rand() * 9000 + 1000)}` : undefined,
        batchNumber: rand() > 0.5 ? `B-${Math.floor(rand() * 900 + 100)}` : undefined,
        status: STATUSES[Math.floor(rand() * STATUSES.length)],
        receiptDate: daysAgo(Math.floor(rand() * 120)),
      });
    }
  }
  return inv;
}

export function generateSampleVelocity(): MovementVelocity[] {
  const rand = seededRandom(99);
  const data: MovementVelocity[] = [];
  const sorted = [...locations].sort(() => rand() - 0.5);

  sorted.forEach((loc, idx) => {
    const pct = idx / sorted.length;
    const cls = pct < 0.2 ? VelocityClass.A : pct < 0.5 ? VelocityClass.B : VelocityClass.C;
    const movementCount = Math.max(1, Math.floor((1 - pct) * 200 * rand() + 1));
    data.push({
      locationId: loc.locationId,
      warehouseId: 'WH-01',
      itemNumber: ITEMS[Math.floor(rand() * ITEMS.length)].num,
      movementCount,
      periodDays: 30,
      velocityClass: cls,
      normalizedFrequency: Math.max(0, Math.min(1, 1 - pct + (rand() - 0.5) * 0.3)),
    });
  });
  return data;
}

export function generateSampleCycleCounts(): CycleCountRecord[] {
  const rand = seededRandom(77);
  return locations.map((loc) => {
    const r = rand();
    let status: CycleCountStatus;
    if (r < 0.15) status = CycleCountStatus.Overdue;
    else if (r < 0.35) status = CycleCountStatus.DueSoon;
    else if (r < 0.7) status = CycleCountStatus.RecentlyCounted;
    else status = CycleCountStatus.NotScheduled;

    return {
      locationId: loc.locationId,
      warehouseId: 'WH-01',
      lastCountedDate: status === CycleCountStatus.RecentlyCounted ? daysAgo(Math.floor(rand() * 14)) : undefined,
      nextDueDate: status === CycleCountStatus.DueSoon ? daysAgo(-Math.floor(rand() * 7 + 1)) : undefined,
      status,
    };
  });
}
