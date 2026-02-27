import { LocationType } from './enums';

// ─── Warehouse Location ───
export interface WarehouseLocation {
  locationId: string;
  warehouseId: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  position: string;
  locationType: LocationType;
  locationProfile: string;
  isLPControlled: boolean;
  isFixed: boolean;
  maxCapacity: number;
  description?: string;
}

// ─── Zone ───
export interface Zone {
  zoneId: string;
  warehouseId: string;
  name: string;
  description?: string;
  locationType: LocationType;
  color?: string;
}

// ─── Aisle ───
export interface Aisle {
  aisleId: string;
  warehouseId: string;
  zone: string;
  name: string;
}

// ─── Rack ───
export interface Rack {
  rackId: string;
  warehouseId: string;
  zone: string;
  aisleId: string;
  name: string;
  shelfCount: number;
  positionsPerShelf: number;
}

// ─── Warehouse Configuration ───
export interface WarehouseConfig {
  warehouseId: string;
  name: string;
  description?: string;
  zones: Zone[];
  aisles: Aisle[];
  racks: Rack[];
  locations: WarehouseLocation[];
}

// ─── Rendered Location (3D position) ───
export interface RenderedLocation {
  locationId: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  opacity: number;
  wireframe: boolean;
  metadata: {
    zone: string;
    aisle: string;
    rack: string;
    shelf: string;
    position: string;
    locationType: LocationType;
    isLPControlled: boolean;
    itemCount: number;
    totalQuantity: number;
    fillPercent: number;
  };
}

// ─── Zone Layout (3D footprint) ───
export interface ZoneLayout {
  zoneId: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  aisleCount: number;
}
