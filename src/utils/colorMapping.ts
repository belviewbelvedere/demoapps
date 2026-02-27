import { LocationType, ViewMode, VelocityClass, CycleCountStatus } from '../models/enums';

// ─── Location Type Colors ───
export const LOCATION_TYPE_COLORS: Record<LocationType, string> = {
  [LocationType.Receiving]: '#22c55e',
  [LocationType.Dispatch]: '#f97316',
  [LocationType.QualityInspection]: '#eab308',
  [LocationType.Production]: '#3b82f6',
  [LocationType.ProductionInput]: '#a78bfa',
  [LocationType.ProductionSupermarket]: '#7c3aed',
  [LocationType.FixedLPTracking]: '#06b6d4',
  [LocationType.BulkStorage]: '#92400e',
  [LocationType.Staging]: '#64748b',
  [LocationType.Pack]: '#ec4899',
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  [LocationType.Receiving]: 'Receiving',
  [LocationType.Dispatch]: 'Dispatch',
  [LocationType.QualityInspection]: 'Quality Inspection',
  [LocationType.Production]: 'Production',
  [LocationType.ProductionInput]: 'Production Input',
  [LocationType.ProductionSupermarket]: 'Production Supermarket',
  [LocationType.FixedLPTracking]: 'Fixed / LP Tracking',
  [LocationType.BulkStorage]: 'Bulk Storage',
  [LocationType.Staging]: 'Staging',
  [LocationType.Pack]: 'Pack',
};

// ─── ABC Velocity Colors ───
export const ABC_COLORS: Record<VelocityClass, string> = {
  [VelocityClass.A]: '#ef4444',
  [VelocityClass.B]: '#f59e0b',
  [VelocityClass.C]: '#22c55e',
  [VelocityClass.Unclassified]: '#64748b',
};

// ─── Cycle Count Status Colors ───
export const CYCLE_COUNT_COLORS: Record<CycleCountStatus, string> = {
  [CycleCountStatus.Overdue]: '#ef4444',
  [CycleCountStatus.DueSoon]: '#f59e0b',
  [CycleCountStatus.RecentlyCounted]: '#22c55e',
  [CycleCountStatus.NotScheduled]: '#64748b',
};

// ─── Heat Map Gradient ───
export function getHeatMapColor(value: number): string {
  const stops = [
    { pos: 0.0, r: 59, g: 130, b: 246 },
    { pos: 0.25, r: 6, g: 182, b: 212 },
    { pos: 0.5, r: 34, g: 197, b: 94 },
    { pos: 0.75, r: 234, g: 179, b: 8 },
    { pos: 1.0, r: 239, g: 68, b: 68 },
  ];

  const clamped = Math.max(0, Math.min(1, value));

  let lower = stops[0];
  let upper = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].pos && clamped <= stops[i + 1].pos) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.pos - lower.pos;
  const t = range === 0 ? 0 : (clamped - lower.pos) / range;

  const r = Math.round(lower.r + (upper.r - lower.r) * t);
  const g = Math.round(lower.g + (upper.g - lower.g) * t);
  const b = Math.round(lower.b + (upper.b - lower.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// ─── Aging Color ───
export function getAgingColor(ageDays: number): string {
  if (ageDays <= 30) return '#22c55e';
  if (ageDays <= 60) return '#eab308';
  if (ageDays <= 90) return '#f97316';
  return '#ef4444';
}

// ─── Utilization Color ───
export function getUtilizationColor(fillPercent: number): string {
  if (fillPercent === 0) return '#334155';
  if (fillPercent < 50) return '#22c55e';
  if (fillPercent < 70) return '#eab308';
  if (fillPercent < 90) return '#f97316';
  return '#ef4444';
}

// ─── View Mode Legend Configuration ───
export interface LegendItem {
  label: string;
  color: string;
}

export function getLegendForMode(mode: ViewMode): LegendItem[] {
  switch (mode) {
    case ViewMode.LocationType:
      return Object.entries(LOCATION_TYPE_COLORS).map(([type, color]) => ({
        label: LOCATION_TYPE_LABELS[type as LocationType],
        color,
      }));
    case ViewMode.HeatMap:
      return [
        { label: 'Low Activity', color: '#3b82f6' },
        { label: 'Medium', color: '#22c55e' },
        { label: 'High Activity', color: '#ef4444' },
      ];
    case ViewMode.ABCClassification:
      return [
        { label: 'A — High Velocity (Top 20%)', color: ABC_COLORS[VelocityClass.A] },
        { label: 'B — Medium (Next 30%)', color: ABC_COLORS[VelocityClass.B] },
        { label: 'C — Slow (Bottom 50%)', color: ABC_COLORS[VelocityClass.C] },
      ];
    case ViewMode.InventoryAging:
      return [
        { label: '0–30 days', color: '#22c55e' },
        { label: '31–60 days', color: '#eab308' },
        { label: '61–90 days', color: '#f97316' },
        { label: '90+ days', color: '#ef4444' },
      ];
    case ViewMode.CycleCount:
      return [
        { label: 'Overdue', color: CYCLE_COUNT_COLORS[CycleCountStatus.Overdue] },
        { label: 'Due Soon', color: CYCLE_COUNT_COLORS[CycleCountStatus.DueSoon] },
        { label: 'Recently Counted', color: CYCLE_COUNT_COLORS[CycleCountStatus.RecentlyCounted] },
        { label: 'Not Scheduled', color: CYCLE_COUNT_COLORS[CycleCountStatus.NotScheduled] },
      ];
    case ViewMode.Utilization:
      return [
        { label: 'Empty', color: '#334155' },
        { label: '< 50%', color: '#22c55e' },
        { label: '50–70%', color: '#eab308' },
        { label: '70–90%', color: '#f97316' },
        { label: '> 90%', color: '#ef4444' },
      ];
    default:
      return [];
  }
}

// ─── Empty Location Color ───
export const EMPTY_LOCATION_COLOR = '#334155';
export const EMPTY_LOCATION_OPACITY = 0.3;
