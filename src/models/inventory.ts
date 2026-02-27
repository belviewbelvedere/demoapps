import { InventoryStatus, VelocityClass, CycleCountStatus } from './enums';

// ─── On-Hand Inventory ───
export interface OnHandInventory {
  locationId: string;
  warehouseId: string;
  itemNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  licensePlate?: string;
  batchNumber?: string;
  serialNumber?: string;
  status: InventoryStatus;
  receiptDate?: string;
  snapshotDate?: string;
}

// ─── Movement Velocity (for ABC Classification) ───
export interface MovementVelocity {
  locationId: string;
  warehouseId: string;
  itemNumber: string;
  movementCount: number;
  periodDays: number;
  velocityClass: VelocityClass;
  normalizedFrequency: number;
}

// ─── Cycle Count Status Record ───
export interface CycleCountRecord {
  locationId: string;
  warehouseId: string;
  lastCountedDate?: string;
  nextDueDate?: string;
  status: CycleCountStatus;
}

// ─── Inventory Snapshot (for time-lapse) ───
export interface InventorySnapshot {
  snapshotDate: string;
  warehouseId: string;
  items: OnHandInventory[];
}

// ─── Location Summary (computed) ───
export interface LocationSummary {
  locationId: string;
  totalQty: number;
  itemCount: number;
  fillPercent: number;
  maxAgeDays?: number;
}
