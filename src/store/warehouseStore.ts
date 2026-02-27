import { create } from 'zustand';
import { ViewMode } from '../models/enums';
import { WarehouseConfig, RenderedLocation } from '../models/warehouse';
import { OnHandInventory, MovementVelocity, CycleCountRecord } from '../models/inventory';
import { WarehouseKPIs, computeKPIs } from '../utils/viewModes';
import {
  sampleWarehouseConfig,
  generateSampleInventory,
  generateSampleVelocity,
  generateSampleCycleCounts,
} from '../data/sampleWarehouse';
import { buildRenderedLocations, computeZoneLayouts } from '../utils/layoutEngine';
import { ZoneLayout } from '../models/warehouse';

export interface WarehouseState {
  config: WarehouseConfig;
  inventory: OnHandInventory[];
  velocityData: MovementVelocity[];
  cycleCountData: CycleCountRecord[];

  viewMode: ViewMode;
  selectedLocationId: string | null;
  searchQuery: string;
  highlightedLocations: string[];
  showKPIPanel: boolean;
  theme: 'dark' | 'light';

  renderedLocations: RenderedLocation[];
  zoneLayouts: ZoneLayout[];
  kpis: WarehouseKPIs;

  setViewMode: (mode: ViewMode) => void;
  selectLocation: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleKPIPanel: () => void;
  toggleTheme: () => void;
  recomputeLayout: () => void;
}

function buildState(
  config: WarehouseConfig,
  inventory: OnHandInventory[],
  velocityData: MovementVelocity[],
  cycleCountData: CycleCountRecord[],
  viewMode: ViewMode,
) {
  return {
    renderedLocations: buildRenderedLocations(config, viewMode, inventory, velocityData, cycleCountData),
    zoneLayouts: computeZoneLayouts(config),
    kpis: computeKPIs(config, inventory, velocityData),
  };
}

const initialInventory = generateSampleInventory();
const initialVelocity = generateSampleVelocity();
const initialCycleCounts = generateSampleCycleCounts();
const initialViewMode = ViewMode.LocationType;
const initialComputed = buildState(
  sampleWarehouseConfig,
  initialInventory,
  initialVelocity,
  initialCycleCounts,
  initialViewMode,
);

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  config: sampleWarehouseConfig,
  inventory: initialInventory,
  velocityData: initialVelocity,
  cycleCountData: initialCycleCounts,

  viewMode: initialViewMode,
  selectedLocationId: null,
  searchQuery: '',
  highlightedLocations: [],
  showKPIPanel: false,
  theme: 'dark' as const,

  ...initialComputed,

  setViewMode: (mode) => {
    const s = get();
    const computed = buildState(s.config, s.inventory, s.velocityData, s.cycleCountData, mode);
    set({ viewMode: mode, ...computed });
  },

  selectLocation: (id) => set({ selectedLocationId: id }),

  setSearchQuery: (query) => {
    const s = get();
    if (!query.trim()) {
      set({ searchQuery: query, highlightedLocations: [] });
      return;
    }
    const q = query.toLowerCase();
    const matched: string[] = [];
    for (const loc of s.config.locations) {
      if (loc.locationId.toLowerCase().includes(q)) matched.push(loc.locationId);
    }
    for (const inv of s.inventory) {
      if (
        inv.itemNumber.toLowerCase().includes(q) ||
        (inv.itemName && inv.itemName.toLowerCase().includes(q)) ||
        (inv.licensePlate && inv.licensePlate.toLowerCase().includes(q))
      ) {
        if (!matched.includes(inv.locationId)) matched.push(inv.locationId);
      }
    }
    set({ searchQuery: query, highlightedLocations: matched });
  },

  toggleKPIPanel: () => set((s) => ({ showKPIPanel: !s.showKPIPanel })),

  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  recomputeLayout: () => {
    const s = get();
    const computed = buildState(s.config, s.inventory, s.velocityData, s.cycleCountData, s.viewMode);
    set(computed);
  },
}));
