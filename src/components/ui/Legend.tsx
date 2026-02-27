import { useWarehouseStore } from '@/store/warehouseStore';
import { getLegendForMode } from '@/utils/colorMapping';

export default function Legend() {
  const viewMode = useWarehouseStore((s) => s.viewMode);
  const theme = useWarehouseStore((s) => s.theme);
  const isDark = theme === 'dark';
  const items = getLegendForMode(viewMode);

  if (items.length === 0) return null;

  return (
    <div className="glass-panel p-3 rounded-xl w-52">
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Legend
      </h3>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
