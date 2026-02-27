// ─── Location Types ───
export enum LocationType {
  Receiving = 'Receiving',
  Dispatch = 'Dispatch',
  QualityInspection = 'QualityInspection',
  Production = 'Production',
  ProductionInput = 'ProductionInput',
  ProductionSupermarket = 'ProductionSupermarket',
  BulkStorage = 'BulkStorage',
  FixedLPTracking = 'FixedLPTracking',
  Staging = 'Staging',
  Pack = 'Pack',
}

// ─── ABC Velocity Class ───
export enum VelocityClass {
  A = 'A',
  B = 'B',
  C = 'C',
  Unclassified = 'Unclassified',
}

// ─── 3D View Modes ───
export enum ViewMode {
  LocationType = 'LocationType',
  HeatMap = 'HeatMap',
  ABCClassification = 'ABCClassification',
  InventoryAging = 'InventoryAging',
  CycleCount = 'CycleCount',
  Utilization = 'Utilization',
}

// ─── Cycle Count Status ───
export enum CycleCountStatus {
  Overdue = 'Overdue',
  DueSoon = 'DueSoon',
  RecentlyCounted = 'RecentlyCounted',
  NotScheduled = 'NotScheduled',
}

// ─── Inventory Status ───
export enum InventoryStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  OnOrder = 'OnOrder',
  Blocked = 'Blocked',
  QualityHold = 'QualityHold',
}
