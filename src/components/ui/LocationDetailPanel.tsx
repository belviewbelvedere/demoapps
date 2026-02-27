import { useWarehouseStore } from '@/store/warehouseStore';
import { LOCATION_TYPE_LABELS } from '@/utils/colorMapping';
import { LocationType } from '@/models/enums';

export default function LocationDetailPanel() {
  const selectedId = useWarehouseStore((s) => s.selectedLocationId);
  const renderedLocations = useWarehouseStore((s) => s.renderedLocations);
  const inventory = useWarehouseStore((s) => s.inventory);
  const selectLocation = useWarehouseStore((s) => s.selectLocation);
  const theme = useWarehouseStore((s) => s.theme);
  const isDark = theme === 'dark';

  if (!selectedId) return null;

  const loc = renderedLocations.find((r) => r.locationId === selectedId);
  const items = inventory.filter((inv) => inv.locationId === selectedId);

  return (
    <div className="glass-panel p-4 rounded-xl w-72 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Location Detail
        </h3>
        <button
          onClick={() => selectLocation(null)}
          className={`text-sm ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          title="Close"
        >
          ✕
        </button>
      </div>

      <p className={`font-mono font-bold text-sm mb-3 break-all ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedId}</p>

      {loc && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-xs">
          <Detail label="Zone" value={loc.metadata.zone} isDark={isDark} />
          <Detail label="Aisle" value={loc.metadata.aisle} isDark={isDark} />
          <Detail label="Rack" value={loc.metadata.rack} isDark={isDark} />
          <Detail label="Shelf" value={String(loc.metadata.shelf)} isDark={isDark} />
          <Detail label="Position" value={String(loc.metadata.position)} isDark={isDark} />
          <Detail
            label="Type"
            value={LOCATION_TYPE_LABELS[loc.metadata.locationType as LocationType] || loc.metadata.locationType}
            isDark={isDark}
          />
          <Detail label="LP Controlled" value={loc.metadata.isLPControlled ? 'Yes' : 'No'} isDark={isDark} />
          <Detail label="Fill" value={`${loc.metadata.fillPercent}%`} isDark={isDark} />
        </div>
      )}

      {loc && (
        <div className="mb-4">
          <div className={`flex items-center justify-between text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Utilization</span>
            <span>{loc.metadata.fillPercent}%</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(loc.metadata.fillPercent, 100)}%`,
                backgroundColor:
                  loc.metadata.fillPercent > 90
                    ? '#ef4444'
                    : loc.metadata.fillPercent > 70
                    ? '#f59e0b'
                    : '#22c55e',
              }}
            />
          </div>
        </div>
      )}

      <div>
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Inventory ({items.length} item{items.length !== 1 ? 's' : ''})
        </p>

        {items.length === 0 ? (
          <p className={`text-xs italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Empty location</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className={`rounded-lg p-2 ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
                <p className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.itemName || item.itemNumber}</p>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.itemNumber}</p>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Qty: <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.quantity} {item.unit}</span>
                  </span>
                  {item.licensePlate && (
                    <span className={`font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.licensePlate}</span>
                  )}
                </div>
                {item.batchNumber && (
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Batch: {item.batchNumber}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <>
      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{label}</span>
      <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{value}</span>
    </>
  );
}
